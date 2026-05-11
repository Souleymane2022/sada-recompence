export type CertificateType =
  | 'formation'
  | 'excellence'
  | 'reconnaissance'
  | 'partenariat'
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
  bodyText: string;
  date: string;
  city: string;
  showDate: boolean;
  signatories: Signatory[];
  partnerLogos: PartnerLogo[];
  certificateNumber: string;
  showCertificateNumber: boolean;
}

export const DEFAULT_BODY_TEXTS: Record<CertificateType, Record<Language, string>> = {
  formation: {
    fr: "pour avoir complété avec succès la formation dispensée par la Smart Africa Digital Academy, démontrant ainsi son engagement envers l'excellence numérique en Afrique.",
    en: "for successfully completing the training program delivered by the Smart Africa Digital Academy, demonstrating commitment to digital excellence across Africa.",
  },
  excellence: {
    fr: "en reconnaissance de son excellence exceptionnelle et de sa contribution remarquable au développement du numérique en Afrique.",
    en: "in recognition of exceptional excellence and remarkable contribution to digital development across Africa.",
  },
  reconnaissance: {
    fr: "en reconnaissance de son engagement exemplaire et de sa contribution significative à la transformation numérique de l'Afrique.",
    en: "in recognition of exemplary commitment and significant contribution to Africa's digital transformation.",
  },
  partenariat: {
    fr: "pour son partenariat stratégique et son soutien indéfectible aux initiatives de transformation numérique portées par Smart Africa et la Smart Africa Digital Academy.",
    en: "for strategic partnership and unwavering support to digital transformation initiatives led by Smart Africa and the Smart Africa Digital Academy.",
  },
  appreciation: {
    fr: "en signe d'appréciation pour son précieux soutien et son dévouement au service du développement numérique de l'Afrique.",
    en: "as a token of appreciation for valuable support and dedication to the service of Africa's digital development.",
  },
  participation: {
    fr: "pour sa participation active et enrichissante à l'événement organisé par Smart Africa et la Smart Africa Digital Academy.",
    en: "for active and enriching participation in the event organized by Smart Africa and the Smart Africa Digital Academy.",
  },
  achievement: {
    fr: "pour ses accomplissements remarquables et sa contribution exceptionnelle à l'avancement de l'agenda numérique africain.",
    en: "for remarkable achievements and exceptional contribution to the advancement of the African digital agenda.",
  },
  custom: {
    fr: "",
    en: "",
  },
};

export const TYPE_LABELS: Record<CertificateType, Record<Language, string>> = {
  formation: { fr: "DE FORMATION", en: "OF TRAINING" },
  excellence: { fr: "D'EXCELLENCE", en: "OF EXCELLENCE" },
  reconnaissance: { fr: "DE RECONNAISSANCE", en: "OF RECOGNITION" },
  partenariat: { fr: "DE PARTENARIAT", en: "OF PARTNERSHIP" },
  appreciation: { fr: "D'APPRÉCIATION", en: "OF APPRECIATION" },
  participation: { fr: "DE PARTICIPATION", en: "OF PARTICIPATION" },
  achievement: { fr: "D'ACCOMPLISSEMENT", en: "OF ACHIEVEMENT" },
  custom: { fr: "", en: "" },
};

export const UI_LABELS = {
  fr: {
    certTitle: "CERTIFICAT",
    awardedTo: "EST DÉCERNÉ À",
    certNumber: "N°",
  },
  en: {
    certTitle: "CERTIFICATE",
    awardedTo: "IS HEREBY AWARDED TO",
    certNumber: "No.",
  },
};
