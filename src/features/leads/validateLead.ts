export type LeadValues = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
    owner: string;
    source: string;
    created_on: string
};

export type LeadErrors = Partial<Record<keyof LeadValues, string>>;

export function validateLead(values : LeadValues) {

    const LEAD_STATUSES = [
        "New",
        "Contacted",
        "Qualified",
        "Lost",
        "Won",
    ];

    const errors: LeadErrors = {};
    
    if (!values.first_name?.trim()) errors.first_name = 'First name is required';
    else if (values.first_name.length > 64) errors.first_name = 'Max 64 characters';

    if (!values.last_name?.trim()) errors.last_name = 'Last name is required';
    else if (values.last_name.length > 64) errors.last_name = 'Max 64 characters';

    if (!values.email?.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email';

    const digits = String(values.phone || '').replace(/[+\s-]/g, '');
    if (!digits) errors.phone = 'Phone is required';
    else if (!/^\d{7,15}$/.test(digits)) errors.phone = 'Phone must be 7 – 15 digits';

    if (!LEAD_STATUSES.includes(values.status)) errors.status = 'Pick a status';
    if (!values.owner?.trim()) errors.owner = 'Owner is required';

    return errors;   // {} means valid
}

export function normalisePhone(input : string) {
  if (!input) return '';
  const cleaned = input.replace(/[\s-]/g, '');
  return cleaned.startsWith('+') ? '+' + cleaned.slice(1).replace(/\D/g, '')
                                 : cleaned.replace(/\D/g, '');
}