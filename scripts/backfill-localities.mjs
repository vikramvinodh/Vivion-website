/**
 * One-time backfill: turn the free-text Property.locality values into real
 * Locality documents, and stamp Property.localitySlug on every listing.
 *
 * Run with:  node --env-file=.env scripts/backfill-localities.mjs
 * Add --dry to print the plan without writing anything.
 *
 * Safe to re-run — it upserts localities and only writes properties whose
 * localitySlug is missing or stale.
 */
import mongoose from 'mongoose';
import slugify from 'slugify';

const DRY = process.argv.includes('--dry');
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI is not set. Try: node --env-file=.env scripts/backfill-localities.mjs');
    process.exit(1);
}

// Loose schemas — this script only touches the fields it cares about, and
// strict:false keeps it from clobbering anything else on the documents.
const Property = mongoose.model(
    'Property',
    new mongoose.Schema({ locality: String, localitySlug: String }, { strict: false, collection: 'properties' }),
);
const Locality = mongoose.model(
    'Locality',
    new mongoose.Schema({}, { strict: false, collection: 'localities' }),
);

await mongoose.connect(uri);
console.log(DRY ? '— DRY RUN, nothing will be written —\n' : '');

const names = (await Property.distinct('locality')).filter(Boolean);

// Several spellings can collapse to one slug ("BTM Layout" / "btm layout").
// Group them so we create one Locality and report the merge.
const bySlug = new Map();
for (const name of names) {
    const slug = slugify(name.trim(), { lower: true, strict: true });
    if (!slug) continue;
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug).push(name);
}

console.log(`Found ${names.length} distinct locality string(s) → ${bySlug.size} locality page(s).\n`);

for (const [slug, variants] of bySlug) {
    // Prefer the longest spelling as the canonical display name — it's almost
    // always the fully written-out one ("BTM Layout" over "BTM").
    const canonical = [...variants].sort((a, b) => b.trim().length - a.trim().length)[0].trim();
    const count = await Property.countDocuments({ locality: { $in: variants } });

    if (variants.length > 1) {
        console.log(`  ⚠ ${slug}: merging ${variants.map((v) => JSON.stringify(v)).join(', ')} → "${canonical}"`);
    }

    if (!DRY) {
        await Locality.updateOne(
            { slug },
            {
                // Only set these on insert so re-runs never overwrite copy
                // someone has since written in the admin panel.
                $setOnInsert: {
                    name: canonical,
                    slug,
                    about: '',
                    metaTitle: '',
                    metaDescription: '',
                    heroImage: '',
                    active: false,
                    createdAt: new Date(),
                },
            },
            { upsert: true },
        );

        // Normalise the display string on the properties too, so the merged
        // spellings all render identically.
        await Property.updateMany(
            { locality: { $in: variants } },
            { $set: { locality: canonical, localitySlug: slug } },
        );
    }

    console.log(`  ${slug.padEnd(24)} ${count} propert${count === 1 ? 'y' : 'ies'}${DRY ? '' : ' ✓'}`);
}

console.log(
    DRY
        ? '\nDry run complete. Re-run without --dry to apply.'
        : '\nDone. All localities are inactive — publish them from /admin/localities once they have copy.',
);

await mongoose.disconnect();
