'use client';

import React, { useCallback, useRef, useState } from 'react';
import Certificate from './Certificate';
import CertificateForm from './CertificateForm';
import { CertificateData, DEFAULT_BODY_TEXTS } from '@/types/certificate';
import { exportAsPDF, exportAsPNG } from '@/lib/exportCertificate';

// A4 landscape intrinsic size
const CERT_W = 1123;
const CERT_H = 794;

const DEFAULT_DATA: CertificateData = {
  type: 'formation',
  customTypeLabel: '',
  language: 'fr',
  recipientName: 'Dr. Aminata Diallo',
  recipientTitle: '',
  bodyText: DEFAULT_BODY_TEXTS['formation']['fr'],
  date: new Date().toISOString().split('T')[0],
  city: 'Kigali',
  showDate: true,
  signatories: [
    {
      id: 'dg-smart-africa',
      name: 'Lacina Koné',
      title: 'Directeur Général',
      organization: 'Smart Africa',
    },
    {
      id: 'dg-sada',
      name: 'Albert Antwi-Boasiako',
      title: 'Directeur Exécutif',
      organization: 'Smart Africa Digital Academy',
    },
  ],
  partnerLogos: [],
  certificateNumber: '',
  showCertificateNumber: false,
};

export default function CertificateGenerator() {
  const [data, setData] = useState<CertificateData>(DEFAULT_DATA);
  const [exporting, setExporting] = useState<'pdf' | 'png' | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const previewWrapRef = useRef<HTMLDivElement>(null);

  // Compute scale so the certificate fits in the preview column
  const getScale = useCallback(() => {
    if (typeof window === 'undefined') return 0.5;
    const available = previewWrapRef.current?.clientWidth ?? 700;
    return Math.min((available - 16) / CERT_W, 1);
  }, []);

  const [scale, setScale] = React.useState(0.55);

  React.useEffect(() => {
    const update = () => {
      if (previewWrapRef.current) {
        const w = previewWrapRef.current.clientWidth - 16;
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
      const filename = `certificat-sada-${data.recipientName.replace(/\s+/g, '-').toLowerCase()}`;
      if (type === 'pdf') await exportAsPDF('certificate-render', filename);
      else await exportAsPNG('certificate-render', filename);
    } finally {
      setExporting(null);
    }
  };

  const recipientSlug = data.recipientName
    ? data.recipientName.split(' ')[0]
    : 'Bénéficiaire';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* ── TOP BAR ── */}
      <header
        style={{
          background: 'var(--navy)',
          borderBottom: '3px solid var(--gold)',
        }}
        className="px-6 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/sada.svg" alt="SADA" className="h-10 brightness-[5] invert" />
          <div>
            <div className="text-white font-bold text-base tracking-wide">
              Générateur de Certificats
            </div>
            <div className="text-xs" style={{ color: 'var(--gold)' }}>
              Smart Africa Digital Academy – Système Officiel
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('png')}
            disabled={!!exporting}
            className="px-4 py-2 text-sm font-semibold rounded-lg border transition-all disabled:opacity-50"
            style={{
              borderColor: 'var(--gold)',
              color: 'var(--gold)',
            }}
          >
            {exporting === 'png' ? '⏳ Export…' : '↓ PNG'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={!!exporting}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-50"
            style={{
              background: 'var(--gold)',
              color: 'var(--navy)',
            }}
          >
            {exporting === 'pdf' ? '⏳ Export…' : '↓ Télécharger PDF'}
          </button>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT – Form panel */}
        <aside
          className="w-80 flex-shrink-0 overflow-y-auto border-r"
          style={{
            borderColor: '#e5e2d8',
            background: '#f0ece4',
          }}
        >
          <div className="p-4">
            <div className="mb-4 text-xs text-gray-500 font-medium uppercase tracking-widest border-b border-gray-200 pb-2">
              Personnalisation
            </div>
            <CertificateForm data={data} onChange={setData} />
          </div>
        </aside>

        {/* RIGHT – Preview panel */}
        <main className="flex-1 flex flex-col items-center overflow-auto p-6">
          <div className="mb-4 flex items-center gap-3">
            <div
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: 'var(--gold)', color: 'var(--navy)' }}
            >
              Aperçu en temps réel
            </div>
            <span className="text-xs text-gray-400">
              {recipientSlug} · {data.type !== 'custom' ? data.type : data.customTypeLabel}
            </span>
          </div>

          {/* Preview wrapper – scales the certificate */}
          <div
            ref={previewWrapRef}
            className="w-full max-w-5xl"
            style={{
              height: CERT_H * scale + 20,
            }}
          >
            <div
              style={{
                width: CERT_W,
                height: CERT_H,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                borderRadius: 4,
              }}
            >
              <Certificate data={data} scale={1} id="certificate-render" />
            </div>
          </div>

          {/* Quick actions below preview */}
          <div className="mt-6 flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all hover:bg-white"
              style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}
            >
              🖨️ Imprimer
            </button>
            <button
              onClick={() => handleExport('png')}
              disabled={!!exporting}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all hover:bg-white disabled:opacity-50"
              style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
            >
              {exporting === 'png' ? '⏳…' : '📷 Exporter PNG'}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={!!exporting}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white transition-all disabled:opacity-50"
              style={{ background: 'var(--navy)' }}
            >
              {exporting === 'pdf' ? '⏳…' : '📄 Exporter PDF A4'}
            </button>
          </div>

          {/* Print hint */}
          <p className="mt-4 text-xs text-gray-400 text-center max-w-md">
            Pour une impression optimale, utilisez &quot;Mise en page : Paysage&quot; et cochez
            &quot;Imprimer les arrière-plans&quot; dans les options d&apos;impression.
          </p>
        </main>
      </div>

      {/* Print stylesheet override */}
      <style jsx global>{`
        @media print {
          header,
          aside,
          .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
          }
          #certificate-render {
            transform: none !important;
            box-shadow: none !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
