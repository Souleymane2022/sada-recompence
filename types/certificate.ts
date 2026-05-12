export type CertificateType =
  | 'training'
  | 'excellence'
  | 'recognition'
  | 'partnership'
  | 'appreciation'
  | 'participation'
  | 'achievement'
  | 'custom';

export type Language = 'fr' | 'en';

export interface PartnerLogo {
  id: string;
  url: string;
  name: string;
}

export interface Signatory {
  id: string;
  name: string;
  title: string;
  organization: string;
  signature?: string; // base64 data URL
}

export interface CertificateData {
  type: CertificateType;
  customTypeLabel: string;
  language: Language;
  recipientName: string;
  recipientTitle: string;
  introText: string;      // "for completing Smart Africa Digital Academy Course on"
  subjectName: string;    // "Artificial Intelligence Essentials"  ← bold field
  date: string;
  showDate: boolean;
  signatories: Signatory[];
  partnerLogos: PartnerLogo[];
  certificateNumber: string;
  showCertificateNumber: boolean;
}

// ── Labels ─────────────────────────────────────────────────────────────────

export const SEAL_LABELS: Record<CertificateType, Record<Language, string>> = {
  training:      { fr: 'FORMATION',     en: 'TRAINING' },
  excellence:    { fr: 'EXCELLENCE',    en: 'EXCELLENCE' },
  recognition:   { fr: 'RECOGNITION',  en: 'RECOGNITION' },
  partnership:   { fr: 'PARTENARIAT',  en: 'PARTNERSHIP' },
  appreciation:  { fr: 'APPRÉCIATION', en: 'APPRECIATION' },
  participation: { fr: 'PARTICIPATION',en: 'PARTICIPATION' },
  achievement:   { fr: 'ACHIEVEMENT',  en: 'ACHIEVEMENT' },
  custom:        { fr: '',             en: '' },
};

export const UI_LABELS = {
  fr: {
    certTitle:   'CERTIFICAT',
    presentedTo: 'CE CERTIFICAT EST DÉCERNÉ À',
    issuedOn:    'Certificat délivré le',
  },
  en: {
    certTitle:   'CERTIFICATE',
    presentedTo: 'THIS CERTIFICATE IS PRESENTED TO',
    issuedOn:    'Certificate issued on',
  },
};

export const DEFAULT_INTRO: Record<CertificateType, Record<Language, string>> = {
  training:      { fr: 'pour avoir complété avec succès le cours de la Smart Africa Digital Academy sur',
                   en: 'for completing Smart Africa Digital Academy Course on' },
  excellence:    { fr: "en reconnaissance de l'excellence dans",
                   en: 'in recognition of excellence in' },
  recognition:   { fr: 'en reconnaissance de sa contribution remarquable à',
                   en: 'in recognition of outstanding contribution to' },
  partnership:   { fr: 'en reconnaissance du précieux partenariat avec',
                   en: 'in recognition of the valued partnership with' },
  appreciation:  { fr: 'en signe d\'appréciation pour sa contribution à',
                   en: 'in appreciation for contributions to' },
  participation: { fr: 'pour sa participation active à',
                   en: 'for active participation in' },
  achievement:   { fr: 'pour ses accomplissements remarquables en matière de',
                   en: 'for remarkable achievements in' },
  custom:        { fr: '', en: '' },
};

export const SEAL_COLORS: Record<CertificateType, { ring: string; text: string; bg: string }> = {
  training:      { ring: '#F59E0B', text: '#78350F', bg: '#FFFBEB' },
  excellence:    { ring: '#0EA5E9', text: '#0369A1', bg: '#F0F9FF' },
  recognition:   { ring: '#4F46E5', text: '#312E81', bg: '#EEF2FF' },
  partnership:   { ring: '#10B981', text: '#064E3B', bg: '#ECFDF5' },
  appreciation:  { ring: '#D946EF', text: '#701A75', bg: '#FDF4FF' },
  participation: { ring: '#6366F1', text: '#312E81', bg: '#EEF2FF' },
  achievement:   { ring: '#EF4444', text: '#7F1D1D', bg: '#FEF2F2' },
  custom:        { ring: '#6B7280', text: '#111827', bg: '#F9FAFB' },
};
