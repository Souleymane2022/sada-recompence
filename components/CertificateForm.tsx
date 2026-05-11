'use client';

import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  CertificateData,
  CertificateType,
  Language,
  Signatory,
  PartnerLogo,
  DEFAULT_INTRO,
} from '@/types/certificate';

interface Props {
  data: CertificateData;
  onChange: (d: CertificateData) => void;
}

const TYPE_OPTIONS: [CertificateType, string, string][] = [
  ['training',      'Formation / Training',   '🎓'],
  ['excellence',    'Excellence',              '🏆'],
  ['recognition',   'Reconnaissance',          '🌟'],
  ['partnership',   'Partenariat',             '🤝'],
  ['appreciation',  'Appréciation',            '💎'],
  ['participation', 'Participation',           '📋'],
  ['achievement',   'Accomplissement',         '🥇'],
  ['custom',        'Personnalisé',            '✏️'],
];

export default function CertificateForm({ data, onChange }: Props) {
  const set = (partial: Partial<CertificateData>) => onChange({ ...data, ...partial });

  const handleTypeChange = (type: CertificateType) => {
    const introText = type === 'custom' ? data.introText : DEFAULT_INTRO[type][data.language];
    set({ type, introText });
  };

  const handleLanguageChange = (language: Language) => {
    const introText = data.type === 'custom' ? data.introText : DEFAULT_INTRO[data.type][language];
    set({ language, introText });
  };

  const addSignatory = () => {
    const newSig: Signatory = { id: crypto.randomUUID(), name: '', title: '', organization: '' };
    set({ signatories: [...data.signatories, newSig] });
  };

  const updateSignatory = (id: string, partial: Partial<Signatory>) =>
    set({ signatories: data.signatories.map((s) => (s.id === id ? { ...s, ...partial } : s)) });

  const removeSignatory = (id: string) =>
    set({ signatories: data.signatories.filter((s) => s.id !== id) });

  const removePartnerLogo = (id: string) =>
    set({ partnerLogos: data.partnerLogos.filter((l) => l.id !== id) });

  const fr = data.language === 'fr';

  return (
    <div className="flex flex-col gap-4 text-sm">

      {/* Language */}
      <Section title="Langue / Language">
        <div className="flex gap-2">
          {(['fr', 'en'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageChange(l)}
              className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                data.language === l ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-gray-200 hover:border-navy'
              }`}
            >
              {l === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
            </button>
          ))}
        </div>
      </Section>

      {/* Certificate type */}
      <Section title={fr ? 'Type de certificat' : 'Certificate type'}>
        <div className="grid grid-cols-2 gap-1.5">
          {TYPE_OPTIONS.map(([type, label, icon]) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                data.type === type
                  ? 'border-[#1B3A6B] bg-[#EFF4FF] text-[#1B3A6B] font-bold'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#1B3A6B]'
              }`}
            >
              <span>{icon}</span>
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
        {data.type === 'custom' && (
          <input
            className="mt-2 field-input"
            placeholder={fr ? 'Intitulé du badge (ex: INNOVATION)' : 'Badge label (e.g. INNOVATION)'}
            value={data.customTypeLabel}
            onChange={(e) => set({ customTypeLabel: e.target.value })}
          />
        )}
      </Section>

      {/* Recipient */}
      <Section title={fr ? 'Bénéficiaire' : 'Recipient'}>
        <label className="field-label">{fr ? 'Nom complet *' : 'Full name *'}</label>
        <input
          className="field-input"
          placeholder={fr ? 'Ex: Uwitonze Eric' : 'e.g. Uwitonze Eric'}
          value={data.recipientName}
          onChange={(e) => set({ recipientName: e.target.value })}
        />
        <label className="field-label mt-2">{fr ? 'Titre / Fonction (optionnel)' : 'Title / Role (optional)'}</label>
        <input
          className="field-input"
          placeholder={fr ? 'Ex: Ministre, Directeur…' : 'e.g. Minister, Director…'}
          value={data.recipientTitle}
          onChange={(e) => set({ recipientTitle: e.target.value })}
        />
      </Section>

      {/* Intro text + subject */}
      <Section title={fr ? 'Contenu du certificat' : 'Certificate content'}>
        <label className="field-label">{fr ? 'Texte d\'introduction' : 'Introduction text'}</label>
        <textarea
          className="field-input min-h-[64px] resize-y"
          value={data.introText}
          onChange={(e) => set({ introText: e.target.value })}
        />
        <label className="field-label mt-2">
          {fr ? 'Nom du cours / sujet (en gras)' : 'Course / subject name (bold)'}
        </label>
        <input
          className="field-input"
          placeholder={fr ? 'Ex: Intelligence Artificielle Essentiels' : 'e.g. Artificial Intelligence Essentials'}
          value={data.subjectName}
          onChange={(e) => set({ subjectName: e.target.value })}
        />
      </Section>

      {/* Date */}
      <Section title={fr ? 'Date' : 'Date'}>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="show-date"
            checked={data.showDate}
            onChange={(e) => set({ showDate: e.target.checked })}
          />
          <label htmlFor="show-date" className="text-gray-600 text-xs">
            {fr ? 'Afficher la date' : 'Show date'}
          </label>
        </div>
        {data.showDate && (
          <input
            type="date"
            className="field-input"
            value={data.date}
            onChange={(e) => set({ date: e.target.value })}
          />
        )}
      </Section>

      {/* Certificate number */}
      <Section title={fr ? 'Numéro de certificat' : 'Certificate number'}>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="show-num"
            checked={data.showCertificateNumber}
            onChange={(e) => set({ showCertificateNumber: e.target.checked })}
          />
          <label htmlFor="show-num" className="text-gray-600 text-xs">
            {fr ? 'Afficher le numéro' : 'Show number'}
          </label>
        </div>
        {data.showCertificateNumber && (
          <input
            className="field-input"
            placeholder="SADA-2025-001"
            value={data.certificateNumber}
            onChange={(e) => set({ certificateNumber: e.target.value })}
          />
        )}
      </Section>

      {/* Signatories */}
      <Section title={fr ? 'Signataires' : 'Signatories'}>
        {data.signatories.map((sig, idx) => (
          <SignatoryCard
            key={sig.id}
            sig={sig}
            index={idx}
            fr={fr}
            onChange={(partial) => updateSignatory(sig.id, partial)}
            onRemove={() => removeSignatory(sig.id)}
          />
        ))}
        <button
          onClick={addSignatory}
          className="mt-1 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-xs font-semibold hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-all"
        >
          + {fr ? 'Ajouter un signataire' : 'Add signatory'}
        </button>
      </Section>

      {/* Partner logos */}
      <Section title={fr ? 'Logos partenaires (bas droite)' : 'Partner logos (bottom right)'}>
        <LogoDropzone fr={fr} onAdd={(logo) => set({ partnerLogos: [...data.partnerLogos, logo] })} />
        {data.partnerLogos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.partnerLogos.map((logo) => (
              <div key={logo.id} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="h-10 w-auto object-contain border border-gray-100 rounded p-1 bg-white"
                />
                <button
                  onClick={() => removePartnerLogo(logo.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-xs font-bold text-[#1B3A6B] uppercase tracking-widest mb-3 pb-2 border-b border-gray-100">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SignatoryCard({
  sig, index, fr, onChange, onRemove,
}: {
  sig: Signatory; index: number; fr: boolean;
  onChange: (p: Partial<Signatory>) => void;
  onRemove: () => void;
}) {
  const sigInputRef = useRef<HTMLInputElement>(null);

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ signature: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-gray-100 rounded-lg p-3 mb-2 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-[#1B3A6B]">
          {fr ? `Signataire ${index + 1}` : `Signatory ${index + 1}`}
        </span>
        <button onClick={onRemove} className="text-red-400 hover:text-red-600 text-xs">
          {fr ? 'Supprimer' : 'Remove'}
        </button>
      </div>
      <input
        className="field-input mb-1"
        placeholder={fr ? 'Nom complet (ex: Mr. Lacina Koné)' : 'Full name (e.g. Mr. Lacina Koné)'}
        value={sig.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <input
        className="field-input mb-1"
        placeholder={fr ? 'Titre (ex: CEO, Directeur Général)' : 'Title (e.g. CEO, Director General)'}
        value={sig.title}
        onChange={(e) => onChange({ title: e.target.value })}
      />
      <input
        className="field-input mb-2"
        placeholder={fr ? 'Organisation' : 'Organization'}
        value={sig.organization}
        onChange={(e) => onChange({ organization: e.target.value })}
      />

      {/* Signature upload */}
      <button
        onClick={() => sigInputRef.current?.click()}
        className="py-1.5 px-3 border border-gray-300 rounded-lg text-gray-600 text-xs hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-all"
      >
        {sig.signature
          ? fr ? '✓ Signature chargée – changer' : '✓ Signature loaded – change'
          : fr ? '📝 Charger la signature (image)' : '📝 Upload signature (image)'}
      </button>
      {sig.signature && (
        <div className="flex items-center gap-2 mt-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sig.signature} alt="sig" className="h-8 object-contain" />
          <button
            onClick={() => onChange({ signature: undefined })}
            className="text-red-400 text-xs hover:text-red-600"
          >
            {fr ? 'Retirer' : 'Remove'}
          </button>
        </div>
      )}
      <input
        ref={sigInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSignatureUpload}
      />
    </div>
  );
}

function LogoDropzone({ fr, onAdd }: { fr: boolean; onAdd: (logo: PartnerLogo) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (files) => {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          onAdd({ id: crypto.randomUUID(), url: reader.result as string, name: file.name });
        };
        reader.readAsDataURL(file);
      });
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
        isDragActive ? 'border-[#1B3A6B] bg-blue-50' : 'border-gray-200 hover:border-[#1B3A6B] hover:bg-blue-50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-xl mb-1">🏢</div>
      <p className="text-xs text-gray-500">
        {isDragActive
          ? fr ? 'Déposez ici…' : 'Drop here…'
          : fr ? 'Glissez les logos ici, ou cliquez pour sélectionner' : 'Drag logos here, or click to select'}
      </p>
    </div>
  );
}
