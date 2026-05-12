'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Printer, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  ChevronRight,
  Monitor
} from 'lucide-react';
import Certificate from './Certificate';
import CertificateForm from './CertificateForm';
import { CertificateData, DEFAULT_INTRO } from '@/types/certificate';
import { exportAsPDF, exportAsPNG } from '@/lib/exportCertificate';

const CERT_W = 1123;
const CERT_H = 794;

const DEFAULT_SA_LOGO  = '/logos/official-smart-africa.png';
const DEFAULT_SADA_LOGO = '/logos/official-sada.jpg';

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
  const isDefault = current.startsWith('/logos/');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div
        className="w-16 h-12 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-300 transition-all"
        onClick={() => inputRef.current?.click()}
      >
        <img src={current} alt={label} className="max-h-10 max-w-[50px] object-contain" />
      </div>
      <div className="flex-1">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <button
          onClick={() => inputRef.current?.click()}
          className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            isDefault
              ? 'bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100'
              : 'bg-green-50 text-green-700 border border-green-100 hover:bg-green-100'
          }`}
        >
          {isDefault ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
          {isDefault ? 'Format Par défaut' : 'Logo personnalisé chargé'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default function CertificateGenerator() {
  const [data, setData] = useState<CertificateData>(DEFAULT_DATA);
  const [exporting, setExporting] = useState<'pdf' | 'png' | null>(null);
  const [saLogo, setSaLogo]   = useState(DEFAULT_SA_LOGO);
  const [sadaLogo, setSadaLogo] = useState(DEFAULT_SADA_LOGO);
  const [showLogoPanel, setShowLogoPanel] = useState(false);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.6);

  React.useEffect(() => {
    // Pre-convert official logos to base64 to ensure html2canvas captures them
    const toBase64 = async (url: string) => {
      try {
        const resp = await fetch(url);
        const blob = await resp.blob();
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.error('Failed to convert logo to base64', e);
        return url;
      }
    };

    const loadLogos = async () => {
      const sa = await toBase64(DEFAULT_SA_LOGO);
      const sada = await toBase64(DEFAULT_SADA_LOGO);
      setSaLogo(sa);
      setSadaLogo(sada);
    };

    loadLogos();

    const update = () => {
      if (previewWrapRef.current) {
        const w = previewWrapRef.current.clientWidth - 40;
        setScale(Math.min(w / CERT_W, 1));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleExport = async (type: 'pdf' | 'png') => {
    setExporting(type);
    const originalScale = scale;
    setScale(1); // Render at 1:1 for pixel-perfect capture

    try {
      // Wait for React to paint at 1:1 scale before capturing
      await new Promise(resolve => setTimeout(resolve, 300));

      const slug = data.recipientName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase() || 'certificat';

      const filename = `certificat-sada-${slug}`;

      if (type === 'pdf') await exportAsPDF('certificate-render', filename);
      else await exportAsPNG('certificate-render', filename);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setScale(originalScale);
      setExporting(null);
    }
  };

  const csvInputRef = useRef<HTMLInputElement>(null);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number } | null>(null);

  const handleBulkCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
      alert("⚠️ Erreur : Le fichier doit être au format CSV.\n\nDans Excel, faites : Fichier > Enregistrer sous > 'CSV (séparateur: point-virgule) (*.csv)' ou 'CSV UTF-8'.");
      if (csvInputRef.current) csvInputRef.current.value = '';
      return;
    }

    const text = await file.text();
    // Split by lines, handle both \r\n and \n
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) {
      alert("Le fichier CSV doit contenir une ligne d'en-tête et au moins une ligne de données.");
      if (csvInputRef.current) csvInputRef.current.value = '';
      return;
    }

    // Detect separator (comma or semicolon)
    const firstLine = lines[0];
    const separator = firstLine.includes(';') ? ';' : ',';

    // Skip header, parse rows
    const rows = lines.slice(1).map(line => {
      // Basic split handling quotes is complex, but for simple names/titles this is fine
      const parts = line.split(separator).map(s => s.replace(/^"|"$/g, '').trim());
      return { 
        name: parts[0] || '', 
        title: parts[1] || '', 
        subject: parts[2] || '' 
      };
    }).filter(r => r.name); // only keep rows with at least a name

    setBulkProgress({ current: 0, total: rows.length });
    const originalScale = scale;
    setScale(1);
    
    // Dynamically import JSZip to avoid bloating initial bundle
    const JSZip = (await import('jszip')).default;
    const { getPDFBlob } = await import('@/lib/exportCertificate');
    const zip = new JSZip();

    try {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        // Update UI with new data
        setData(prev => ({
          ...prev,
          recipientName: row.name || prev.recipientName,
          recipientTitle: row.title || prev.recipientTitle,
          subjectName: row.subject || prev.subjectName,
        }));

        // Wait for React to render the new text
        await new Promise(resolve => setTimeout(resolve, 400));

        const blob = await getPDFBlob('certificate-render');
        
        const slug = (row.name || `cert-${i}`)
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/gi, '-')
          .toLowerCase();
          
        zip.file(`certificat-sada-${slug}.pdf`, blob);
        
        setBulkProgress({ current: i + 1, total: rows.length });
      }

      setBulkProgress({ current: rows.length, total: rows.length }); // "Zipping..." state
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `certificats-sada-bulk.zip`;
      link.click();

    } catch (err) {
      console.error('Bulk export failed:', err);
      alert('Une erreur est survenue lors de la génération en masse.');
    } finally {
      setScale(originalScale);
      setBulkProgress(null);
      if (csvInputRef.current) csvInputRef.current.value = ''; // Reset input
    }
  };


  const saIsDefault   = saLogo.endsWith('.svg');
  const sadaIsDefault = sadaLogo.endsWith('.svg');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-2 bg-[#1B3A6B] rounded-2xl shadow-lg"
          >
            <img src={saLogo} alt="Smart Africa" className="h-8 w-auto brightness-0 invert" />
          </motion.div>
          <div>
            <h1 className="text-lg font-black text-[#1B3A6B] tracking-tight flex items-center gap-2 uppercase">
              SADA Certificate
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-black tracking-widest">PRO</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Générateur Officiel Smart Africa
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowLogoPanel(!showLogoPanel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              saIsDefault || sadaIsDefault 
                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100' 
                : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'
            }`}
          >
            <Settings className={`w-4 h-4 ${showLogoPanel ? 'rotate-90' : ''} transition-transform`} />
            {saIsDefault || sadaIsDefault ? 'Logos (SVG)' : 'Logos (OK)'}
          </button>

          <div className="h-8 w-px bg-slate-200 mx-2" />

          <button
            onClick={() => handleExport('pdf')}
            disabled={!!exporting}
            className="flex items-center gap-2 bg-[#1B3A6B] hover:bg-[#254B85] text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50"
          >
            {exporting === 'pdf' ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Download className="w-4 h-4" />
              </motion.div>
            ) : <Download className="w-4 h-4" />}
            {exporting === 'pdf' ? 'Génération...' : 'Télécharger PDF'}
          </button>
        </div>
      </header>

      {/* ── LOGO UPLOAD PANEL ── */}
      <AnimatePresence>
        {showLogoPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50/80 backdrop-blur-sm border-b border-slate-100"
          >
            <div className="px-8 py-6 flex flex-wrap gap-8 items-center max-w-7xl mx-auto">
              <div className="flex-1">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Qualité de Rendu</h4>
                <p className="text-xs text-slate-500 max-w-sm">Pour une qualité optimale lors de l&apos;export, utilisez des fichiers PNG haute résolution plutôt que les SVGs par défaut.</p>
              </div>
              <LogoUploadBox label="Smart Africa" current={saLogo} onChange={setSaLogo} />
              <LogoUploadBox label="SADA Digital Academy" current={sadaLogo} onChange={setSadaLogo} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BULK EXPORT PROGRESS MODAL ── */}
      <AnimatePresence>
        {bulkProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4">Génération en Masse</h3>
              
              <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                <motion.div 
                  className="bg-blue-600 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                />
              </div>

              <p className="text-sm text-slate-500 font-medium">
                {bulkProgress.current === bulkProgress.total 
                  ? "Création du fichier ZIP..." 
                  : `Certificat ${bulkProgress.current} sur ${bulkProgress.total}`}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT – Sidebar */}
        <aside className="w-[380px] flex-shrink-0 overflow-y-auto border-r border-slate-100 bg-white/50 backdrop-blur-xl custom-scrollbar">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Configuration</h2>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </div>
            <CertificateForm data={data} onChange={setData} />
          </div>
        </aside>

        {/* RIGHT – Main Viewport */}
        <main className="flex-1 flex flex-col items-center overflow-auto py-12 px-8 bg-slate-50">
          <div className="mb-12 flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Édition en direct</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                <Monitor className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-slate-200" />
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Zoom: {Math.round(scale * 100)}%</div>
            </div>
          </div>

          {/* Scaled Certificate Frame */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div
              ref={previewWrapRef}
              className="bg-white rounded-2xl p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-white"
              style={{ 
                width: CERT_W * scale + 32, 
                height: CERT_H * scale + 32 
              }}
            >
              <div
                style={{
                  width: CERT_W,
                  height: CERT_H,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
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

            {/* Decorative dots for the frame */}
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-slate-200 rounded-tl-lg" />
            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-slate-200 rounded-tr-lg" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-slate-200 rounded-bl-lg" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-slate-200 rounded-br-lg" />
          </motion.div>

          {/* Actions Bar */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-16 flex gap-4 p-2 bg-white/50 backdrop-blur-xl rounded-2xl border border-white shadow-xl"
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={csvInputRef} 
              onChange={handleBulkCSV} 
            />
            <button
              onClick={() => csvInputRef.current?.click()}
              disabled={!!exporting || !!bulkProgress}
              className="flex items-center gap-2 px-6 py-3 text-sm font-black text-slate-600 hover:bg-white rounded-xl transition-all disabled:opacity-50"
            >
              Import CSV
            </button>
            <div className="w-px h-10 bg-slate-200/50 my-1" />
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 text-sm font-black text-[#1B3A6B] hover:bg-white rounded-xl transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
            <button
              onClick={() => handleExport('png')}
              disabled={!!exporting || !!bulkProgress}
              className="flex items-center gap-2 px-6 py-3 text-sm font-black text-teal-600 hover:bg-white rounded-xl transition-all disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              {exporting === 'png' ? '...' : 'PNG HD'}
            </button>
            <div className="w-px h-10 bg-slate-200/50 my-1" />
            <button
              onClick={() => handleExport('pdf')}
              disabled={!!exporting || !!bulkProgress}
              className="flex items-center gap-2 px-8 py-3 text-sm font-black bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Exporter PDF
            </button>
          </motion.div>

          <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center max-w-md">
            Smart Africa Digital Academy &copy; 2025 <br/> 
            <span className="text-slate-300">Généré avec précision pour l&apos;excellence académique</span>
          </p>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        @media print {
          header, aside, .no-print { display: none !important; }
          main { padding: 0 !important; align-items: flex-start !important; background: white !important; }
          #certificate-render { transform: none !important; box-shadow: none !important; }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
}
