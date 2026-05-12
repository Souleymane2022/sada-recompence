'use client';

import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Award, 
  User, 
  FileText, 
  Calendar, 
  Hash, 
  PenTool, 
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronDown
} from 'lucide-react';
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
    <div className="flex flex-col gap-6 text-sm pb-10">
      {/* Language */}
      <Section title="Langue / Language" icon={<Globe className="w-4 h-4" />}>
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {(['fr', 'en'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageChange(l)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                data.language === l 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {l === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
            </button>
          ))}
        </div>
      </Section>

      {/* Certificate type */}
      <Section title={fr ? 'Type de certificat' : 'Certificate type'} icon={<Award className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-2">
          {TYPE_OPTIONS.map(([type, label, icon]) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`py-2.5 px-3 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-2 ${
                data.type === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              <span className="text-sm">{icon}</span>
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {data.type === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-3"
            >
              <input
                id="custom-type-label"
                name="customTypeLabel"
                className="field-input"
                placeholder={fr ? 'Intitulé (ex: INNOVATION)' : 'Label (e.g. INNOVATION)'}
                value={data.customTypeLabel}
                onChange={(e) => set({ customTypeLabel: e.target.value })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* Recipient */}
      <Section title={fr ? 'Bénéficiaire' : 'Recipient'} icon={<User className="w-4 h-4" />}>
        <div className="space-y-4">
          <div>
            <label htmlFor="recipient-name" className="field-label">{fr ? 'Nom complet *' : 'Full name *'}</label>
            <input
              id="recipient-name"
              name="recipientName"
              className="field-input"
              placeholder={fr ? 'Ex: Uwitonze Eric' : 'e.g. Uwitonze Eric'}
              value={data.recipientName}
              onChange={(e) => set({ recipientName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="recipient-title" className="field-label">{fr ? 'Titre / Fonction' : 'Title / Role'}</label>
            <input
              id="recipient-title"
              name="recipientTitle"
              className="field-input"
              placeholder={fr ? 'Ex: Ministre, Directeur…' : 'e.g. Minister, Director…'}
              value={data.recipientTitle}
              onChange={(e) => set({ recipientTitle: e.target.value })}
            />
          </div>
        </div>
      </Section>

      {/* Content */}
      <Section title={fr ? 'Contenu' : 'Content'} icon={<FileText className="w-4 h-4" />}>
        <div className="space-y-4">
          <div>
            <label htmlFor="intro-text" className="field-label">{fr ? 'Texte d\'introduction' : 'Introduction text'}</label>
            <textarea
              id="intro-text"
              name="introText"
              className="field-input min-h-[80px] resize-none"
              value={data.introText}
              onChange={(e) => set({ introText: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="subject-name" className="field-label">{fr ? 'Sujet (en gras)' : 'Subject (bold)'}</label>
            <input
              id="subject-name"
              name="subjectName"
              className="field-input"
              placeholder={fr ? 'Ex: Intelligence Artificielle' : 'e.g. Artificial Intelligence'}
              value={data.subjectName}
              onChange={(e) => set({ subjectName: e.target.value })}
            />
          </div>
        </div>
      </Section>

      {/* Date & Number */}
      <div className="grid grid-cols-2 gap-4">
        <Section title={fr ? 'Date' : 'Date'} icon={<Calendar className="w-4 h-4" />}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="show-date"
                name="showDate"
                className="w-4 h-4 accent-blue-500 rounded border-slate-300"
                checked={data.showDate}
                onChange={(e) => set({ showDate: e.target.checked })}
              />
              <label htmlFor="show-date" className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">
                {fr ? 'Afficher' : 'Show'}
              </label>
            </div>
            <AnimatePresence>
              {data.showDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <input
                    id="cert-date"
                    name="date"
                    type="date"
                    className="field-input py-1.5"
                    value={data.date}
                    onChange={(e) => set({ date: e.target.value })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Section>

        <Section title={fr ? 'Numéro' : 'Number'} icon={<Hash className="w-4 h-4" />}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="show-num"
                name="showCertificateNumber"
                className="w-4 h-4 accent-blue-500 rounded border-slate-300"
                checked={data.showCertificateNumber}
                onChange={(e) => set({ showCertificateNumber: e.target.checked })}
              />
              <label htmlFor="show-num" className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">
                {fr ? 'Afficher' : 'Show'}
              </label>
            </div>
            <AnimatePresence>
              {data.showCertificateNumber && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <input
                    id="cert-number"
                    name="certificateNumber"
                    className="field-input py-1.5"
                    placeholder="SADA-001"
                    value={data.certificateNumber}
                    onChange={(e) => set({ certificateNumber: e.target.value })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Section>
      </div>

      {/* Signatories */}
      <Section title={fr ? 'Signataires' : 'Signatories'} icon={<PenTool className="w-4 h-4" />}>
        <div className="space-y-3">
          <AnimatePresence initial={false}>
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
          </AnimatePresence>
          <button
            onClick={addSignatory}
            className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {fr ? 'Ajouter un signataire' : 'Add signatory'}
          </button>
        </div>
      </Section>

      {/* Partner logos */}
      <Section title={fr ? 'Partenaires' : 'Partners'} icon={<ImageIcon className="w-4 h-4" />}>
        <LogoDropzone fr={fr} onAdd={(logo) => set({ partnerLogos: [...data.partnerLogos, logo] })} />
        <AnimatePresence>
          {data.partnerLogos.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex flex-wrap gap-3"
            >
              {data.partnerLogos.map((logo) => (
                <motion.div 
                  key={logo.id} 
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative group"
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className="h-12 w-auto object-contain border border-slate-100 rounded-lg p-1.5 bg-white shadow-sm"
                  />
                  <button
                    onClick={() => removePartnerLogo(logo.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Section>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sidebar-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
          {icon}
        </div>
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
          {fr ? `Signataire ${index + 1}` : `Signatory ${index + 1}`}
        </span>
        <button onClick={onRemove} className="text-slate-300 hover:text-red-500 transition-colors p-1">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        <input
          id={`sig-name-${sig.id}`}
          name={`sig-name-${sig.id}`}
          className="field-input py-1.5"
          placeholder={fr ? 'Nom complet' : 'Full name'}
          value={sig.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <input
          id={`sig-title-${sig.id}`}
          name={`sig-title-${sig.id}`}
          className="field-input py-1.5"
          placeholder={fr ? 'Titre / Fonction' : 'Title / Role'}
          value={sig.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <input
          id={`sig-org-${sig.id}`}
          name={`sig-org-${sig.id}`}
          className="field-input py-1.5"
          placeholder={fr ? 'Organisation' : 'Organization'}
          value={sig.organization}
          onChange={(e) => onChange({ organization: e.target.value })}
        />

        <div className="pt-2">
          <button
            onClick={() => sigInputRef.current?.click()}
            className={`w-full py-2 px-3 border border-slate-200 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2 ${
              sig.signature ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {sig.signature ? <PenTool className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
            {sig.signature
              ? fr ? 'Signature chargée' : 'Signature loaded'
              : fr ? 'Charger la signature' : 'Upload signature'}
          </button>
          
          {sig.signature && (
            <div className="flex items-center justify-between mt-2 px-1">
              <img src={sig.signature} alt="sig" className="h-6 object-contain opacity-60" />
              <button
                onClick={() => onChange({ signature: undefined })}
                className="text-[10px] font-bold text-red-400 hover:text-red-600"
              >
                {fr ? 'Supprimer' : 'Remove'}
              </button>
            </div>
          )}
        </div>
      </div>
      <input
        ref={sigInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSignatureUpload}
      />
    </motion.div>
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
      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="mb-2 flex justify-center">
        <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100">
          <ImageIcon className={`w-6 h-6 ${isDragActive ? 'text-blue-500' : 'text-slate-300'}`} />
        </div>
      </div>
      <p className="text-[11px] font-bold text-slate-500 leading-relaxed px-2">
        {isDragActive
          ? fr ? 'Déposez ici…' : 'Drop here…'
          : fr ? 'Glissez les logos ici, ou cliquez pour sélectionner' : 'Drag logos here, or click to select'}
      </p>
    </div>
  );
}
