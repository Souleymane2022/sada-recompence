'use client';

import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  CertificateData,
  CertificateType,
  Language,
  Signatory,
  PartnerLogo,
  DEFAULT_BODY_TEXTS,
} from '@/types/certificate';

interface Props {
  data: CertificateData;
  onChange: (d: CertificateData) => void;
}

export default function CertificateForm({ data, onChange }: Props) {
  const set = (partial: Partial<CertificateData>) => onChange({ ...data, ...partial });

  const handleTypeChange = (type: CertificateType) => {
    const bodyText =
      type === 'custom'
        ? data.bodyText
        : DEFAULT_BODY_TEXTS[type][data.language];
    set({ type, bodyText });
  };

  const handleLanguageChange = (language: Language) => {
    const bodyText =
      data.type === 'custom'
        ? data.bodyText
        : DEFAULT_BODY_TEXTS[data.type][language];
    set({ language, bodyText });
  };

  const addSignatory = () => {
    const newSig: Signatory = {
      id: crypto.randomUUID(),
      name: '',
      title: '',
      organization: '',
    };
    set({ signatories: [...data.signatories, newSig] });
  };

  const updateSignatory = (id: string, partial: Partial<Signatory>) => {
    set({
      signatories: data.signatories.map((s) =>
        s.id === id ? { ...s, ...partial } : s
      ),
    });
  };

  const removeSignatory = (id: string) => {
    set({ signatories: data.signatories.filter((s) => s.id !== id) });
  };

  const removePartnerLogo = (id: string) => {
    set({ partnerLogos: data.partnerLogos.filter((l) => l.id !== id) });
  };

  return (
    <div className="flex flex-col gap-5 text-sm">
      {/* ── Language ── */}
      <Section title="Langue / Language">
        <div className="flex gap-2">
          {(['fr', 'en'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageChange(l)}
              className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${
                data.language === l
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy border-gray-200 hover:border-gold'
              }`}
            >
              {l === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Certificate type ── */}
      <Section title={data.language === 'fr' ? 'Type de certificat' : 'Certificate type'}>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ['formation', data.language === 'fr' ? 'Formation' : 'Training'],
              ['excellence', 'Excellence'],
              ['reconnaissance', data.language === 'fr' ? 'Reconnaissance' : 'Recognition'],
              ['partenariat', data.language === 'fr' ? 'Partenariat' : 'Partnership'],
              ['appreciation', data.language === 'fr' ? 'Appréciation' : 'Appreciation'],
              ['participation', 'Participation'],
              ['achievement', data.language === 'fr' ? 'Accomplissement' : 'Achievement'],
              ['custom', data.language === 'fr' ? 'Personnalisé' : 'Custom'],
            ] as [CertificateType, string][]
          ).map(([type, label]) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                data.type === type
                  ? 'bg-gold text-white border-gold'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gold'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {data.type === 'custom' && (
          <input
            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
            placeholder={data.language === 'fr' ? 'Intitulé personnalisé...' : 'Custom label...'}
            value={data.customTypeLabel}
            onChange={(e) => set({ customTypeLabel: e.target.value })}
          />
        )}
      </Section>

      {/* ── Recipient ── */}
      <Section title={data.language === 'fr' ? 'Bénéficiaire' : 'Recipient'}>
        <label className="field-label">{data.language === 'fr' ? 'Nom complet *' : 'Full name *'}</label>
        <input
          className="field-input"
          placeholder={data.language === 'fr' ? 'Ex: Dr. Aminata Diallo' : 'e.g. Dr. Aminata Diallo'}
          value={data.recipientName}
          onChange={(e) => set({ recipientName: e.target.value })}
        />
        <label className="field-label mt-2">{data.language === 'fr' ? 'Titre / Fonction (optionnel)' : 'Title / Role (optional)'}</label>
        <input
          className="field-input"
          placeholder={data.language === 'fr' ? 'Ex: Directeur, Minister…' : 'e.g. Director, Minister…'}
          value={data.recipientTitle}
          onChange={(e) => set({ recipientTitle: e.target.value })}
        />
      </Section>

      {/* ── Body text ── */}
      <Section title={data.language === 'fr' ? 'Texte du certificat' : 'Certificate text'}>
        <textarea
          className="field-input min-h-[100px] resize-y"
          value={data.bodyText}
          onChange={(e) => set({ bodyText: e.target.value })}
        />
      </Section>

      {/* ── Date & Location ── */}
      <Section title={data.language === 'fr' ? 'Date & Lieu' : 'Date & Location'}>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="show-date"
            checked={data.showDate}
            onChange={(e) => set({ showDate: e.target.checked })}
            className="accent-gold"
          />
          <label htmlFor="show-date" className="text-gray-600">
            {data.language === 'fr' ? 'Afficher la date' : 'Show date'}
          </label>
        </div>
        {data.showDate && (
          <div className="flex gap-2">
            <input
              className="field-input flex-1"
              placeholder={data.language === 'fr' ? 'Ville' : 'City'}
              value={data.city}
              onChange={(e) => set({ city: e.target.value })}
            />
            <input
              type="date"
              className="field-input flex-1"
              value={data.date}
              onChange={(e) => set({ date: e.target.value })}
            />
          </div>
        )}
      </Section>

      {/* ── Certificate number ── */}
      <Section title={data.language === 'fr' ? 'Numéro de certificat' : 'Certificate number'}>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="show-num"
            checked={data.showCertificateNumber}
            onChange={(e) => set({ showCertificateNumber: e.target.checked })}
            className="accent-gold"
          />
          <label htmlFor="show-num" className="text-gray-600">
            {data.language === 'fr' ? 'Afficher le numéro' : 'Show number'}
          </label>
        </div>
        {data.showCertificateNumber && (
          <input
            className="field-input"
            placeholder="SADA-2024-001"
            value={data.certificateNumber}
            onChange={(e) => set({ certificateNumber: e.target.value })}
          />
        )}
      </Section>

      {/* ── Signatories ── */}
      <Section title={data.language === 'fr' ? 'Signataires' : 'Signatories'}>
        {data.signatories.map((sig, idx) => (
          <SignatoryCard
            key={sig.id}
            sig={sig}
            index={idx}
            language={data.language}
            onChange={(partial) => updateSignatory(sig.id, partial)}
            onRemove={() => removeSignatory(sig.id)}
          />
        ))}
        <button
          onClick={addSignatory}
          className="mt-2 w-full py-2 border-2 border-dashed border-gold/40 rounded-lg text-gold text-xs font-semibold hover:border-gold hover:bg-gold/5 transition-all"
        >
          + {data.language === 'fr' ? 'Ajouter un signataire' : 'Add signatory'}
        </button>
      </Section>

      {/* ── Partner logos ── */}
      <Section title={data.language === 'fr' ? 'Logos des partenaires' : 'Partner logos'}>
        <LogoDropzone
          language={data.language}
          onAdd={(logo) => set({ partnerLogos: [...data.partnerLogos, logo] })}
        />
        {data.partnerLogos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {data.partnerLogos.map((logo) => (
              <div key={logo.id} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="h-12 w-auto object-contain border border-gray-100 rounded p-1"
                />
                <button
                  onClick={() => removePartnerLogo(logo.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center"
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

// ── Sub-components ────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-3">{title}</h3>
      {children}
    </div>
  );
}

function SignatoryCard({
  sig,
  index,
  language,
  onChange,
  onRemove,
}: {
  sig: Signatory;
  index: number;
  language: Language;
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
        <span className="text-xs font-semibold text-navy">
          {language === 'fr' ? `Signataire ${index + 1}` : `Signatory ${index + 1}`}
        </span>
        <button onClick={onRemove} className="text-red-400 hover:text-red-600 text-xs">
          {language === 'fr' ? 'Supprimer' : 'Remove'}
        </button>
      </div>
      <input
        className="field-input mb-1"
        placeholder={language === 'fr' ? 'Nom complet' : 'Full name'}
        value={sig.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <input
        className="field-input mb-1"
        placeholder={language === 'fr' ? 'Titre (ex: Directeur Général)' : 'Title (e.g. Director General)'}
        value={sig.title}
        onChange={(e) => onChange({ title: e.target.value })}
      />
      <input
        className="field-input mb-2"
        placeholder={language === 'fr' ? 'Organisation' : 'Organization'}
        value={sig.organization}
        onChange={(e) => onChange({ organization: e.target.value })}
      />

      {/* Signature upload */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => sigInputRef.current?.click()}
          className="py-1.5 px-3 border border-gold/50 rounded-lg text-gold text-xs hover:bg-gold/5 transition-all"
        >
          {sig.signature
            ? language === 'fr'
              ? '✓ Signature chargée – changer'
              : '✓ Signature loaded – change'
            : language === 'fr'
            ? 'Charger la signature'
            : 'Upload signature'}
        </button>
        {sig.signature && (
          <button
            onClick={() => onChange({ signature: undefined })}
            className="text-red-400 text-xs hover:text-red-600"
          >
            {language === 'fr' ? 'Retirer' : 'Remove'}
          </button>
        )}
      </div>
      {sig.signature && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={sig.signature} alt="sig" className="mt-2 h-10 object-contain" />
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

function LogoDropzone({
  language,
  onAdd,
}: {
  language: Language;
  onAdd: (logo: PartnerLogo) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (files) => {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          onAdd({
            id: crypto.randomUUID(),
            url: reader.result as string,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-gold bg-gold/5'
          : 'border-gray-200 hover:border-gold hover:bg-gold/5'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-2xl mb-1">🖼️</div>
      <p className="text-xs text-gray-500">
        {isDragActive
          ? language === 'fr'
            ? 'Déposez ici…'
            : 'Drop here…'
          : language === 'fr'
          ? 'Glissez les logos partenaires ici, ou cliquez'
          : 'Drag partner logos here, or click to select'}
      </p>
    </div>
  );
}
