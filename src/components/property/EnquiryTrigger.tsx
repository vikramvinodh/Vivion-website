"use client";

import { useState } from 'react';
import LeadModal from '@/components/LeadModal';

interface Props {
    propertySlug: string;
    propertyTitle: string;
    className?: string;
    children: React.ReactNode;
}

// A flexible "Add Enquiry" button that opens the shared LeadModal.
// Style it via className so it can be primary, outline, etc.
export default function EnquiryTrigger({ propertySlug, propertyTitle, className, children }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className={className}>
                {children}
            </button>
            <LeadModal
                open={open}
                onClose={() => setOpen(false)}
                title="Enquire about this home"
                subtitle={propertyTitle}
                source="Property Enquiry"
                propertySlug={propertySlug}
                propertyTitle={propertyTitle}
            />
        </>
    );
}
