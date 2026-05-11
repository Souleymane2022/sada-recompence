'use client';

import React, { useRef, useState } from 'react';
import Certificate from './Certificate';
import CertificateForm from './CertificateForm';
import { CertificateData, DEFAULT_INTRO } from '@/types/certificate';
import { exportAsPDF, exportAsPNG } from '@/lib/exportCertificate';

const CERT_W = 1123;
const CERT_H = 794;

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

export default function CertificateGenerator() {
  const [data, setData] = useState<CertificateData>(DEFAULT_DATA);
  const [exporting, setExporting] = useState<'pdf' | 'png' | null>(null);
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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F0EDE8' }}>
      {/* ── TOP BAR ── */}
      <header
        style={{ background: '#1B3A6B', borderBottom: '3px solid #00B0BE' }}
        className="px-6 py-3 flex items-center justify-between flex-shrink-0"
      >
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/smart-africa.svg" alt="Smart Africa" style={{ height: 44, filter: 'brightness(0) invert(1)' }} />
          <div>
            <div className="text-white font-bold text-base tracking-wide">
              Générateur de Certificats Officiels
            </div>
            <div className="text-xs" style={{ color: '#00B0BE' }}>
              Smart Africa &amp; Smart Africa Digital Academy
            </div>
          </div>
        </div>

        <div className="flex gap-2">
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

      {/* ── MAIN ── */}
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
          {/* Badge */}
          <div className="mb-5 flex items-center gap-3">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: '#1B3A6B' }}
            >
              Aperçu en temps réel
            </span>
          </div>

          {/* Scaled certificate preview */}
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
              <Certificate data={data} scale={1} id="certificate-render" />
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
            Pour impression : choisir orientation Paysage et activer
            &quot;Imprimer les arrière-plans&quot;.
          </p>
        </main>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          header, aside { display: none !important; }
          main { padding: 0 !important; align-items: flex-start !important; }
          #certificate-render { transform: none !important; box-shadow: none !important; }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
}
