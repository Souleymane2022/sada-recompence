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
  training:      { ring: '#8B6914', text: '#3A2800', bg: '#FFF8E7' },
  excellence:    { ring: '#C8A84B', text: '#5A3A00', bg: '#FFFBF0' },
  recognition:   { ring: '#1B3A6B', text: '#0D1F3C', bg: '#EFF4FF' },
  partnership:   { ring: '#00A651', text: '#004020', bg: '#EDFFF5' },
  appreciation:  { ring: '#9B59B6', text: '#4A1060', bg: '#F8EEFF' },
  participation: { ring: '#2980B9', text: '#0D3A5C', bg: '#EBF5FF' },
  achievement:   { ring: '#E74C3C', text: '#6B1010', bg: '#FFF0EF' },
  custom:        { ring: '#555555', text: '#222222', bg: '#F5F5F5' },
};
