// Parses admin's pasted WhatsApp-style property listings ("Owner Name : X",
// "BHK : 3 BHK", …) into structured PropertyForm data. Built to survive the
// messy reality of copy-pasted text: inconsistent labels ("Mob" vs "Owner
// Number"), invisible characters WhatsApp inserts, values in shorthand
// ("26k", "8 months"), typos ("Esst"), and multiple listings pasted at once.
//
// Nothing recognized is ever silently dropped — anything we can't map to a
// known field, or aren't confident about, goes into `notes`/`warnings` so
// the admin can review and fix it in the form rather than lose it.

export type ParsedProperty = {
    data: Record<string, string | number | boolean>;
    warnings: string[];
    sourceLines: string[];
};

// --- key normalization -----------------------------------------------------

// Strips WhatsApp's zero-width joiners/spaces, bullet markers, punctuation —
// so "* ⁠Mob" and "mob" and "Mob:" all normalize to the same "mob".
function normalizeKey(raw: string): string {
    return raw
        .replace(/[\u200B-\u200F\u2060-\u2064\uFEFF]/g, '')
        .replace(/^[\s*•\-–]+/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

// Each field lists every phrasing seen in the wild. Matching is exact-after-
// normalization first, then "contains", so new minor variants still land
// correctly instead of falling through to notes.
const FIELD_ALIASES: Record<string, string[]> = {
    ownerName: ['owner name', 'owner', 'name'],
    ownerNumber: ['owner number', 'owner mobile', 'mob', 'mobile', 'phone', 'contact', 'contact number', 'number'],
    bhk: ['bhk'],
    sqft: ['sq ft', 'sqft', 'sq feet', 'square feet', 'built up area', 'area'],
    balcony: ['balcony'],
    facing: ['facing'],
    propertyType: ['property type', 'type'],
    locality: ['locality', 'location'],
    nearbyLandmarks: ['nearby', 'nearby landmarks', 'landmark', 'landmarks'],
    rent: ['rent'],
    maintenance: ['maintenance'],
    deposit: ['deposit'],
    bathrooms: ['bathroom', 'bathrooms', 'bath'],
    totalFloor: ['total floor', 'total floors'],
    availableFloor: ['available floor', 'available floors', 'floor'],
    petsFriendly: ['pets friendly', 'pet friendly', 'pets'],
    furnishing: ['furnishing'],
    religionRestrictions: ['religious restrictions', 'religion restrictions', 'religion', 'religious restriction'],
    eatingHabits: ['eating habits', 'eating habit', 'eating'],
    powerBackup: ['power backup', 'power back up', 'power back-up', 'backup'],
    lift: ['lift'],
    parking: ['car parking', 'parking'],
    availability: ['property availability', 'availability'],
};

// Longest-alias-first exact/contains match so "owner name" doesn't get
// grabbed by the shorter "owner" (which would collide with ownerNumber-ish
// junk) or "name" alone.
const SORTED_ALIASES = Object.entries(FIELD_ALIASES)
    .flatMap(([field, aliases]) => aliases.map((alias) => ({ field, alias })))
    .sort((a, b) => b.alias.length - a.alias.length);

function matchField(normalizedKey: string): string | null {
    for (const { field, alias } of SORTED_ALIASES) {
        if (normalizedKey === alias) return field;
    }
    for (const { field, alias } of SORTED_ALIASES) {
        if (normalizedKey.includes(alias)) return field;
    }
    return null;
}

// --- value coercion ----------------------------------------------------

function cleanValue(raw: string): string {
    return raw.replace(/[\u200B-\u200F\u2060-\u2064\uFEFF]/g, '').trim();
}

// "36000" -> 36000, "26k" -> 26000, "3k" -> 3000, "1,50,000" -> 150000
function parseAmount(raw: string): number | null {
    const v = cleanValue(raw).toLowerCase();
    const m = v.match(/([\d,]+(?:\.\d+)?)\s*(k)?/);
    if (!m) return null;
    let n = parseFloat(m[1].replace(/,/g, ''));
    if (isNaN(n)) return null;
    if (m[2]) n *= 1000;
    return Math.round(n);
}

function parseYesNo(raw: string): boolean | null {
    const v = cleanValue(raw).toLowerCase();
    if (/^y(es)?\b/.test(v)) return true;
    if (/^no?\b/.test(v)) return false;
    return null;
}

// Levenshtein distance, capped small — only used to catch typos like "Esst"
// -> "East", not to make loose guesses.
function distance(a: string, b: string): number {
    const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[a.length][b.length];
}

// Snaps free text to a known option list, tolerating small typos. Returns
// null (rather than guessing) when nothing is close enough.
function closestOption(raw: string, options: string[], maxDistance = 2): { value: string; corrected: boolean } | null {
    const v = cleanValue(raw).toLowerCase();
    for (const opt of options) {
        if (opt.toLowerCase() === v) return { value: opt, corrected: false };
    }
    for (const opt of options) {
        if (opt.toLowerCase().includes(v) || v.includes(opt.toLowerCase())) return { value: opt, corrected: false };
    }
    let best: { value: string; d: number } | null = null;
    for (const opt of options) {
        const d = distance(v, opt.toLowerCase());
        if (d <= maxDistance && (!best || d < best.d)) best = { value: opt, d };
    }
    return best ? { value: best.value, corrected: true } : null;
}

const FACING_OPTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const FURNISHING_OPTIONS = ['Unfurnished', 'Semi Furnished', 'Fully Furnished'];
const EATING_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Both'];
const PROPERTY_TYPE_OPTIONS = ['Apartment', 'Independent House', 'Villa', 'Studio', 'Penthouse'];

// "1 floor" / "1st floor" / "2" -> "1st Floor" / "2nd Floor"
function ordinalFloor(raw: string): string {
    const v = cleanValue(raw);
    const m = v.match(/\d+/);
    if (!m) return v;
    const n = parseInt(m[0], 10);
    const suffix = n % 10 === 1 && n % 100 !== 11 ? 'st'
        : n % 10 === 2 && n % 100 !== 12 ? 'nd'
        : n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th';
    return `${n}${suffix} Floor`;
}

// --- block splitting ---------------------------------------------------

// A new field starts either at the beginning of a line, or at a bullet
// marker (*, •, -) -- whichever comes first. We scan the whole pasted blob
// rather than going line-by-line because some paste paths (copying from a
// chat export, some phone keyboards) collapse line breaks and leave every
// listing running together on one physical line, e.g.
// "...Car parking : yes or * Owner Name: Suresh...". A pure per-line parser
// would swallow "Suresh" into the previous field's value and lose the whole
// next listing; scanning for bullets/labels anywhere in the text recovers
// it regardless of where the line breaks landed.
const DELIM_RE = /(?:^|\*|•)[ \t]*([A-Za-z][A-Za-z .\/&\-]{1,30}?)[ \t]*:[ \t]*/gm;

function extractLines(text: string): { key: string; value: string }[] {
    const cleaned = text.replace(/[\u200B-\u200F\u2060-\u2064\uFEFF]/g, '');
    const matches = [...cleaned.matchAll(DELIM_RE)];
    const out: { key: string; value: string }[] = [];
    for (let i = 0; i < matches.length; i++) {
        const m = matches[i];
        const start = (m.index ?? 0) + m[0].length;
        const end = i + 1 < matches.length ? matches[i + 1].index! : cleaned.length;
        const value = cleaned.slice(start, end).replace(/\s+/g, ' ').trim();
        if (value) out.push({ key: m[1], value });
    }
    return out;
}

// Splits pasted text into one block per listing. New "Owner Name" (or
// alias) line after we've already seen one starts a new block — that's the
// one field every listing in practice always leads with.
function splitBlocks(entries: { key: string; value: string }[]): { key: string; value: string }[][] {
    const blocks: { key: string; value: string }[][] = [];
    let current: { key: string; value: string }[] = [];
    for (const entry of entries) {
        const field = matchField(normalizeKey(entry.key));
        if (field === 'ownerName' && current.length > 0) {
            blocks.push(current);
            current = [];
        }
        current.push(entry);
    }
    if (current.length) blocks.push(current);
    return blocks;
}

// --- main parse ----------------------------------------------------------

function parseSingleBlock(entries: { key: string; value: string }[]): ParsedProperty {
    const data: Record<string, string | number | boolean> = {};
    const warnings: string[] = [];
    const sourceLines = entries.map((e) => `${e.key}: ${e.value}`);

    for (const { key, value } of entries) {
        const normKey = normalizeKey(key);
        const field = matchField(normKey);
        const val = cleanValue(value);
        if (!val) continue;

        if (!field) {
            // Unrecognized label — never dropped, kept for manual review.
            data.notes = data.notes ? `${data.notes}\n${key.trim()}: ${val}` : `${key.trim()}: ${val}`;
            continue;
        }

        switch (field) {
            case 'ownerName':
            case 'ownerNumber':
                // Owner number sometimes carries extra junk (e.g. "9845365065")
                // — keep digits/+ only if it looks numeric, else keep as-is.
                data[field] = field === 'ownerNumber' ? (val.match(/[\d+]{7,}/)?.[0] || val) : val;
                break;

            case 'bhk':
                data.bhk = /bhk/i.test(val) ? val : `${val} BHK`;
                break;

            case 'sqft': {
                const n = parseAmount(val);
                if (n != null) data.sqft = n;
                else warnings.push(`Sq. ft: couldn't read "${val}" as a number — please fill in manually.`);
                break;
            }

            case 'balcony': {
                const b = parseYesNo(val);
                if (b != null) data.balcony = b;
                if (/\(/.test(val)) {
                    // "yes (small)" — keep the parenthetical detail.
                    data.notes = data.notes ? `${data.notes}\nBalcony: ${val}` : `Balcony: ${val}`;
                }
                break;
            }

            case 'facing': {
                const match = closestOption(val, FACING_OPTIONS);
                if (match) {
                    data.facing = match.value;
                    if (match.corrected) warnings.push(`Facing: read "${val}" as "${match.value}" — please verify.`);
                } else {
                    data.facing = val;
                    warnings.push(`Facing: "${val}" isn't a standard option — please pick one manually.`);
                }
                break;
            }

            case 'propertyType': {
                // "Apartment (Stone Bridge Magnatize)" -> type + building name.
                const paren = val.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
                const typeRaw = paren ? paren[1] : val;
                if (paren) data.buildingName = paren[2].trim();
                const match = closestOption(typeRaw, PROPERTY_TYPE_OPTIONS);
                if (match) {
                    data.propertyType = match.value;
                    if (match.corrected) warnings.push(`Property Type: read "${typeRaw}" as "${match.value}" — please verify.`);
                } else {
                    data.propertyType = typeRaw.trim();
                    warnings.push(`Property Type: "${typeRaw}" isn't a standard option — please pick one manually.`);
                }
                break;
            }

            case 'locality':
                // Kept as raw text — PropertyForm matches/creates against the
                // controlled locality list and will flag if it's new.
                data.locality = val;
                break;

            case 'nearbyLandmarks':
                data.nearbyLandmarks = val;
                break;

            case 'rent': {
                const n = parseAmount(val);
                if (n != null) data.rent = n;
                else warnings.push(`Rent: couldn't read "${val}" as an amount — please fill in manually.`);
                break;
            }

            case 'maintenance': {
                const n = parseAmount(val);
                // Only treat as a number if the value is mostly digits — text
                // like "Electricity & water charges" is a real, common answer
                // here, not a typo, so it's kept as a note rather than forced
                // into a number.
                if (n != null && /^[\d,.\sk₹rs]+$/i.test(val)) {
                    data.maintenance = n;
                } else {
                    data.maintenance = 0;
                    data.maintenanceNote = val;
                }
                break;
            }

            case 'deposit':
                data.deposit = val;
                break;

            case 'bathrooms': {
                const n = parseAmount(val);
                if (n != null) data.bathrooms = n;
                else warnings.push(`Bathrooms: couldn't read "${val}" as a number — please fill in manually.`);
                break;
            }

            case 'totalFloor': {
                const m = val.match(/\d+/);
                data.totalFloor = m ? m[0] : val;
                break;
            }

            case 'availableFloor':
                data.availableFloor = /floor/i.test(val) && !/^\d+$/.test(val.trim()) ? val : ordinalFloor(val);
                break;

            case 'petsFriendly': {
                const b = parseYesNo(val);
                if (b != null) data.petsFriendly = b;
                if (/\(/.test(val)) {
                    data.notes = data.notes ? `${data.notes}\nPets Friendly: ${val}` : `Pets Friendly: ${val}`;
                }
                break;
            }

            case 'furnishing': {
                const match = closestOption(val, FURNISHING_OPTIONS);
                if (match) {
                    data.furnishing = match.value;
                    if (match.corrected) warnings.push(`Furnishing: read "${val}" as "${match.value}" — please verify.`);
                } else {
                    data.furnishing = val;
                    warnings.push(`Furnishing: "${val}" isn't a standard option — please pick one manually.`);
                }
                break;
            }

            case 'religionRestrictions':
                data.religionRestrictions = /^any$/i.test(val) ? 'No restriction' : val;
                break;

            case 'eatingHabits': {
                const match = closestOption(val, EATING_OPTIONS);
                if (match) {
                    data.eatingHabits = match.value;
                } else {
                    data.eatingHabits = val;
                    warnings.push(`Eating Habits: "${val}" isn't a standard option — please pick one manually.`);
                }
                break;
            }

            case 'powerBackup': {
                const b = parseYesNo(val);
                if (b != null) data.powerBackup = b;
                break;
            }

            case 'lift': {
                const b = parseYesNo(val);
                if (b != null) data.lift = b;
                break;
            }

            case 'parking':
                data.parking = val;
                break;

            case 'availability':
                data.availability = /ready/i.test(val) ? 'Ready to move' : val;
                break;
        }
    }

    // Owner name/number and BHK are the fields every real listing has —
    // their absence usually means the paste didn't match our line format at
    // all, so flag it loudly rather than silently returning an empty form.
    if (!data.ownerName) warnings.push('Owner Name not found in the pasted text.');
    if (!data.bhk) warnings.push('BHK not found in the pasted text.');

    return { data, warnings, sourceLines };
}

export function parseProperties(text: string): ParsedProperty[] {
    const entries = extractLines(text);
    if (!entries.length) return [];
    const blocks = splitBlocks(entries);
    return blocks.map(parseSingleBlock);
}
