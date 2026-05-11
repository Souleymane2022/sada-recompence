'use client';

import React, { useRef, useState } from 'react';
import Certificate from './Certificate';
import CertificateForm from './CertificateForm';
import { CertificateData, DEFAULT_INTRO } from '@/types/certificate';
import { exportAsPDF, exportAsPNG } from '@/lib/exportCertificate';

const CERT_W = 1123;
const CERT_H = 794;

// Default logos (SVG fallback until user uploads their real PNGs)
const DEFAULT_SA_LOGO  = '/logos/smart-africa.svg';
const DEFAULT_SADA_LOGO = '/logos/sada.svg';

const DEFAULT_DATA: CertificateData = {
  type: 'training',
  customTypeLabel: '',
  language: 'en',
  recipientName: 'Uwitonze Eric',
  recipientTitle: '',
  introText: DEFAULT_INTRO['training']['en'],
  subjectName: 'Artificial Intelligence Essentials',
  date: '2025-08-21',
  showDate: true,
  signatories: [
    {
      id: 'lacina-kone',
      name: 'Mr. Lacina Koné',
      title: 'CEO',
      organization: 'Smart Africa',
    },
  ],
  partnerLogos: [],
  certificateNumber: '',
  showCertificateNumber: false,
};

// ── Logo uploader ─────────────────────────────────────────────────────────────
function LogoUploadBox({
  label,
  current,
  onChange,
}: {
  label: string;
  current: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isDefault = current.endsWith('.svg');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Preview */}
      <div
        className="w-24 h-12 border border-gray-200 rounded bg-white flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => inputRef.current?.click()}
        title="Cliquer pour changer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current} alt={label} className="max-h-11 max-w-[90px] object-contain" />
      </div>
      <div>
        <div className="text-xs font-bold text-[#1B3A6B]">{label}</div>
        <button
          onClick={() => inputRef.current?.click()}
          className={`text-xs mt-0.5 px-2 py-1 rounded border transition-all ${
            isDefault
              ? 'border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100'
              : 'border-green-400 text-green-700 bg-green-50 hover:bg-green-100'
          }`}
        >
          {isDefault ? '⚠️ SVG approx. – cliquer pour le vrai PNG' : '✓ Vrai logo chargé – changer'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CertificateGenerator() {
  const [data, setData] = useState<CertificateData>(DEFAULT_DATA);
  const [exporting, setExporting] = useState<'pdf' | 'png' | null>(null);
  const [saLogo, setSaLogo]   = useState(DEFAULT_SA_LOGO);
  const [sadaLogo, setSadaLogo] = useState(DEFAULT_SADA_LOGO);
  const [showLogoPanel, setShowLogoPanel] = useState(false);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.6);

  React.useEffect(() => {
    const update = () => {
      if (previewWrapRef.current) {
        const w = previewWrapRef.current.clientWidth - 8;
        setScale(Math.min(w / CERT_W, 1));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleExport = async (type: 'pdf' | 'png') => {
    setExporting(type);
    try {
      const slug = data.recipientName.replace(/\s+/g, '-').toLowerCase() || 'certificat';
      const filename = `certificat-sada-${slug}`;
      if (type === 'pdf') await exportAsPDF('certificate-render', filename);
      else await exportAsPNG('certificate-render', filename);
    } finally {
      setExporting(null);
    }
  };

  const saIsDefault   = saLogo.endsWith('.svg');
  const sadaIsDefault = sadaLogo.endsWith('.svg');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F0EDE8' }}>
      {/* ── TOP BAR ── */}
      <header
        style={{ background: '#1B3A6B', borderBottom: '3px solid #00B0BE' }}
        className="px-6 py-3 flex items-center justify-between flex-shrink-0"
      >
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={saLogo} alt="Smart Africa" style={{ height: 40, filter: 'brightness(0) invert(1)' }} />
          <div>
            <div className="text-white font-bold text-base tracking-wide">
              Générateur de Certificats Officiels
            </div>
            <div className="text-xs" style={{ color: '#00B0BE' }}>
              Smart Africa &amp; Smart Africa Digital Academy
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Logo upload indicator */}
          {(saIsDefault || sadaIsDefault) && (
            <button
              onClick={() => setShowLogoPanel(!showLogoPanel)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-orange-400 text-orange-300 hover:bg-orange-400/20 transition-all"
              title="Charger les vrais logos PNG"
            >
              ⚠️ Logos SVG · {showLogoPanel ? 'Fermer' : 'Charger les vrais'}
            </button>
          )}
          {!saIsDefault && !sadaIsDefault && (
            <button
              onClick={() => setShowLogoPanel(!showLogoPanel)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-green-400 text-green-300 hover:bg-green-400/20 transition-all"
            >
              ✓ Vrais logos chargés
            </button>
          )}
          <button
            onClick={() => handleExport('png')}
            disabled={!!exporting}
            className="px-4 py-2 text-sm font-semibold rounded-lg border transition-all disabled:opacity-50"
            style={{ borderColor: '#00B0BE', color: '#00B0BE' }}
          >
            {exporting === 'png' ? '⏳…' : '↓ PNG'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={!!exporting}
            className="px-5 py-2 text-sm font-bold rounded-lg transition-all disabled:opacity-50 text-white"
            style={{ background: '#00B0BE' }}
          >
            {exporting === 'pdf' ? '⏳ Génération…' : '↓ Télécharger PDF'}
          </button>
        </div>
      </header>

      {/* ── LOGO UPLOAD PANEL ── */}
      {showLogoPanel && (
        <div
          className="px-6 py-4 border-b border-gray-200 flex flex-wrap gap-6 items-center"
          style={{ background: '#FFF8F0' }}
        >
          <div className="text-sm font-bold text-[#1B3A6B] mr-2">
            📥 Charger les vrais logos (PNG/JPG) :
          </div>
          <LogoUploadBox
            label="Smart Africa Logo"
            current={saLogo}
            onChange={setSaLogo}
          />
          <LogoUploadBox
            label="SADA Logo"
            current={sadaLogo}
            onChange={setSadaLogo}
          />
          <div className="text-xs text-gray-500 italic max-w-xs">
            Les logos sont utilisés uniquement localement dans votre navigateur — rien n&apos;est envoyé sur un serveur.
          </div>
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT – form */}
        <aside
          className="w-80 flex-shrink-0 overflow-y-auto border-r border-gray-200"
          style={{ background: '#EAE6E0' }}
        >
          <div className="p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-4">
              Personnalisation
            </p>
            <CertificateForm data={data} onChange={setData} />
          </div>
        </aside>

        {/* RIGHT – preview */}
        <main className="flex-1 flex flex-col items-center overflow-auto py-8 px-4">
          <div className="mb-5 flex items-center gap-3 flex-wrap justify-center">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: '#1B3A6B' }}
            >
              Aperçu en temps réel
            </span>
            {(saIsDefault || sadaIsDefault) && (
              <span
                className="text-xs px-3 py-1 rounded-full cursor-pointer"
                style={{ background: '#FFF3CD', color: '#856404' }}
                onClick={() => setShowLogoPanel(true)}
              >
                ⚠️ Clique ici pour charger tes vrais logos PNG Smart Africa &amp; SADA
              </span>
            )}
          </div>

          {/* Scaled preview */}
          <div
            ref={previewWrapRef}
            className="w-full max-w-5xl"
            style={{ height: CERT_H * scale + 4 }}
          >
            <div
              style={{
                width: CERT_W,
                height: CERT_H,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
              }}
            >
              <Certificate
                data={data}
                scale={1}
                id="certificate-render"
                saLogo={saLogo}
                sadaLogo={sadaLogo}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all hover:bg-white"
              style={{ borderColor: '#1B3A6B', color: '#1B3A6B' }}
            >
              🖨️ Imprimer
            </button>
            <button
              onClick={() => handleExport('png')}
              disabled={!!exporting}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all hover:bg-white disabled:opacity-50"
              style={{ borderColor: '#00B0BE', color: '#00B0BE' }}
            >
              {exporting === 'png' ? '⏳…' : '📷 Exporter PNG HD'}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={!!exporting}
              className="px-5 py-2.5 text-sm font-bold rounded-xl text-white transition-all disabled:opacity-50"
              style={{ background: '#1B3A6B' }}
            >
              {exporting === 'pdf' ? '⏳…' : '📄 Exporter PDF A4'}
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center max-w-md">
            Pour impression : orientation Paysage + &quot;Imprimer les arrière-plans&quot;.
          </p>
        </main>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          header, aside, .no-print { display: none !important; }
          main { padding: 0 !important; align-items: flex-start !important; }
          #certificate-render { transform: none !important; box-shadow: none !important; }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
}
