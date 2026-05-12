'use client';

import React from 'react';
import {
  CertificateData,
  SEAL_LABELS,
  SEAL_COLORS,
  UI_LABELS,
  DEFAULT_INTRO,
} from '@/types/certificate';

interface Props {
  data: CertificateData;
  scale?: number;
  id?: string;
  saLogo?: string;
  sadaLogo?: string;
}

const W = 1123;
const H = 794;

const SQ = 6;
const GAP = 2;
const CELL = SQ + GAP; // 8px

function cellColor(col: number, row: number): string | null {
  const n = Math.abs(Math.sin(col * 12.9898 + row * 78.233) * 43758.5453) % 1;
  if (n < 0.50) return null; 

  if (n < 0.65) return '#00B0BE'; // teal
  if (n < 0.75) return '#1B3A6B'; // navy
  if (n < 0.85) return '#F7941D'; // orange
  if (n < 0.95) return '#D1D5DB'; // gray
  return '#F3F4F6'; // light gray
}

function PixelBorder() {
  const rects: React.ReactNode[] = [];
  const colsH = Math.ceil(W / CELL);
  const rowsV = Math.ceil(H / CELL);

  // Outer thin teal line
  rects.push(
    <rect key="outer-line" x={10} y={10} width={W - 20} height={H - 20} fill="none" stroke="#00B0BE" strokeWidth={1} />
  );

  // Inner thin teal line
  rects.push(
    <rect key="inner-line" x={50} y={50} width={W - 100} height={H - 100} fill="none" stroke="#00B0BE" strokeWidth={0.8} />
  );

  const OFFSET = 15;
  const ROWS = 4;
  const OPACITY = 0.8;

  // Top
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < colsH; c++) {
      const color = cellColor(c, r);
      const x = c * CELL;
      if (color && x > 12 && x < W - 12) {
        rects.push(<rect key={`t-${r}-${c}`} x={x} y={OFFSET + r * CELL} width={SQ} height={SQ} fill={color} fillOpacity={OPACITY} rx={0.5} />);
      }
    }
  }

  // Bottom
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < colsH; c++) {
      const color = cellColor(c, r + 100);
      const x = c * CELL;
      if (color && x > 12 && x < W - 12) {
        rects.push(<rect key={`b-${r}-${c}`} x={x} y={H - OFFSET - (r + 1) * CELL + (CELL - SQ)} width={SQ} height={SQ} fill={color} fillOpacity={OPACITY} rx={0.5} />);
      }
    }
  }

  // Left
  for (let r = 0; r < rowsV; r++) {
    for (let c = 0; c < ROWS; c++) {
      const color = cellColor(c + 200, r);
      const y = r * CELL;
      if (color && y > 12 && y < H - 12) {
        rects.push(<rect key={`l-${r}-${c}`} x={OFFSET + c * CELL} y={y} width={SQ} height={SQ} fill={color} fillOpacity={OPACITY} rx={0.5} />);
      }
    }
  }

  // Right
  for (let r = 0; r < rowsV; r++) {
    for (let c = 0; c < ROWS; c++) {
      const color = cellColor(c + 300, r);
      const y = r * CELL;
      if (color && y > 12 && y < H - 12) {
        rects.push(<rect key={`rr-${r}-${c}`} x={W - OFFSET - (c + 1) * CELL + (CELL - SQ)} y={y} width={SQ} height={SQ} fill={color} fillOpacity={OPACITY} rx={0.5} />);
      }
    }
  }

  return (
    <svg
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      width={W}
      height={H}
    >
      {rects}
    </svg>
  );
}

function CertSeal({
  label,
  customLabel,
  type,
}: {
  label: string;
  customLabel: string;
  type: CertificateData['type'];
}) {
  const display = type === 'custom' ? customLabel.toUpperCase() : label;
  const { ring, text, bg } = SEAL_COLORS[type];
  const R = 50; 
  const cx = R + 5;
  const cy = R + 5;
  const size = (R + 5) * 2;

  const arcR = R - 8;
  const chars = 'CERTIFICATE • SADA •'.split('');
  const totalAngle = 360;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
      <defs>
        <radialGradient id="sealGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.05} />
        </radialGradient>
      </defs>
      
      <circle cx={cx} cy={cy} r={R} fill={ring} />
      <circle cx={cx} cy={cy} r={R - 3} fill={bg} />
      <circle cx={cx} cy={cy} r={R - 3} fill="url(#sealGrad)" />
      
      <circle cx={cx} cy={cy} r={R - 10} fill="none" stroke={ring} strokeWidth={0.5} strokeDasharray="1 2" />

      {chars.map((ch, i) => {
        const angle = (totalAngle / chars.length) * i - 90;
        const rad = (angle * Math.PI) / 180;
        const x = cx + arcR * Math.cos(rad);
        const y = cy + arcR * Math.sin(rad);
        const rotate = angle + 90;
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="var(--font-montserrat), Arial"
            fontSize={7}
            fontWeight="800"
            fill={ring}
            transform={`rotate(${rotate}, ${x}, ${y})`}
            style={{ opacity: 0.8 }}
          >
            {ch}
          </text>
        );
      })}

      <circle cx={cx} cy={cy} r={R - 18} fill="#FFF" stroke={ring} strokeWidth={1.5} />
      
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-montserrat), Arial"
        fontSize={display.length > 9 ? 8 : 10}
        fontWeight="900"
        fill={text}
        letterSpacing={0.5}
      >
        {display}
      </text>
    </svg>
  );
}

export default function Certificate({ 
  data, 
  scale = 1, 
  id = 'certificate-render', 
  saLogo = '/logos/official-smart-africa.png', 
  sadaLogo = '/logos/official-sada.jpg' 
}: Props) {
  const lang = data.language;
  const ui = UI_LABELS[lang];
  const sealLabel = SEAL_LABELS[data.type][lang];

  const formatDate = (iso: string) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div
      id={id}
      style={{
        width: W,
        height: H,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter), Arial, sans-serif',
      }}
    >
      <PixelBorder />

      {/* ── HEADER ── */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 100,
          right: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <img
          src={saLogo}
          alt="Smart Africa"
          style={{ height: 85, objectFit: 'contain' }}
          crossOrigin={saLogo?.startsWith('data:') ? undefined : 'anonymous'}
        />

        <img
          src={sadaLogo}
          alt="Smart Africa Digital Academy"
          style={{ height: 52, objectFit: 'contain' }}
          crossOrigin={sadaLogo?.startsWith('data:') ? undefined : 'anonymous'}
        />
      </div>

      {/* ── BODY ── */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 100,
          right: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#1B3A6B',
            letterSpacing: 2,
            marginBottom: 35,
            fontFamily: 'var(--font-montserrat), sans-serif',
            textTransform: 'uppercase'
          }}
        >
          {ui.presentedTo}
        </div>

        <div
          style={{
            width: '80%',
            height: 75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '2px solid rgba(0, 176, 190, 0.2)',
            marginBottom: data.recipientTitle ? 10 : 40,
          }}
        >
          <div
            style={{
              fontSize: data.recipientName.length > 30 ? 36 : 52,
              fontWeight: 800,
              fontStyle: 'italic',
              color: '#1B3A6B',
              lineHeight: 1,
              fontFamily: 'var(--font-inter), sans-serif',
              textAlign: 'center',
            }}
          >
            {data.recipientName || 'Nom du Bénéficiaire'}
          </div>
        </div>

        {data.recipientTitle && (
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#4B5563',
              marginBottom: 30,
              fontFamily: 'var(--font-inter), sans-serif',
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            {data.recipientTitle}
          </div>
        )}

        <div
          style={{
            fontSize: 16,
            color: '#4B5563',
            lineHeight: 1.6,
            marginBottom: 10,
            maxWidth: '85%',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {data.introText || DEFAULT_INTRO[data.type][data.language]}
        </div>

        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: '#1B3A6B',
            marginBottom: 40,
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {data.subjectName}
        </div>
      </div>

      {/* ── SEAL (Center Bottom) ── */}
      <div style={{ position: 'absolute', bottom: 150, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <CertSeal
          label={sealLabel}
          customLabel={data.customTypeLabel}
          type={data.type}
        />
      </div>

      {/* ── FOOTER (Signatures & Date) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          left: 100,
          right: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        {/* Signatories */}
        <div style={{ display: 'flex', gap: 80, alignItems: 'flex-end' }}>
          {data.signatories.map((sig) => (
            <div key={sig.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {sig.signature && (
                <img 
                  src={sig.signature} 
                  alt="Signature" 
                  style={{ height: 60, marginBottom: 5 }} 
                  crossOrigin={sig.signature.startsWith('data:') ? undefined : 'anonymous'} 
                />
              )}
              <div style={{ width: 180, borderTop: '1px solid #1B3A6B', paddingTop: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>{sig.name}</div>
                <div style={{ fontSize: 11, color: '#6B7280', maxWidth: 180 }}>{sig.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Date & Partner Logos */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 20 }}>
          {data.showDate && data.date && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>{ui.issuedOn}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>{formatDate(data.date)}</div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            {data.partnerLogos.map((logo) => (
              <img
                key={logo.id}
                src={logo.url}
                alt={logo.name}
                style={{ height: 45, objectFit: 'contain' }}
                crossOrigin={logo.url?.startsWith('data:') ? undefined : 'anonymous'}
              />
            ))}
          </div>

          {data.showCertificateNumber && data.certificateNumber && (
            <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
              ID: {data.certificateNumber}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
