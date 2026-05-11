'use client';

import React, { useMemo } from 'react';
import {
  CertificateData,
  SEAL_LABELS,
  SEAL_COLORS,
  UI_LABELS,
} from '@/types/certificate';

interface Props {
  data: CertificateData;
  scale?: number;
  id?: string;
}

// A4 landscape at 96 dpi
const W = 1123;
const H = 794;

// ── Pixel border settings ────────────────────────────────────────────────────
const SQ = 10;   // square size px
const GAP = 2;   // gap px
const CELL = SQ + GAP;  // 12px per cell
const BORDER_ROWS = 3;  // how many rows of squares on each edge
const BORDER_THICK = BORDER_ROWS * CELL; // 36px

// Deterministic colour for a given grid cell (x, y)
function cellColor(col: number, row: number): string {
  const n = Math.abs((col * 31337 + row * 1337 + col * row * 7 + col * 13 + row * 97)) % 100;
  if (n < 6)  return '#1B3A6B'; // navy
  if (n < 11) return '#00B0BE'; // teal
  if (n < 15) return '#F7941D'; // orange
  if (n < 40) return '#C8C8C8'; // light gray
  if (n < 70) return '#AAAAAA'; // medium gray
  return '#E5E5E5';             // very light gray
}

// ── PixelBorder ──────────────────────────────────────────────────────────────
function PixelBorder() {
  const rects: React.ReactNode[] = [];
  const colsH = Math.ceil(W / CELL);
  const rowsV = Math.ceil((H - 2 * BORDER_THICK) / CELL);

  // Top + Bottom strips
  for (let r = 0; r < BORDER_ROWS; r++) {
    for (let c = 0; c < colsH; c++) {
      const x = c * CELL;
      // Top
      rects.push(
        <rect key={`t-${r}-${c}`} x={x} y={r * CELL} width={SQ} height={SQ} fill={cellColor(c, r)} rx={1} />
      );
      // Bottom
      rects.push(
        <rect
          key={`b-${r}-${c}`}
          x={x}
          y={H - BORDER_THICK + r * CELL}
          width={SQ}
          height={SQ}
          fill={cellColor(c, r + 100)}
          rx={1}
        />
      );
    }
  }

  // Left + Right strips (middle section only – no corner overlap)
  for (let r = 0; r < rowsV; r++) {
    for (let c = 0; c < BORDER_ROWS; c++) {
      const y = BORDER_THICK + r * CELL;
      // Left
      rects.push(
        <rect key={`l-${r}-${c}`} x={c * CELL} y={y} width={SQ} height={SQ} fill={cellColor(c + 200, r)} rx={1} />
      );
      // Right
      rects.push(
        <rect
          key={`rr-${r}-${c}`}
          x={W - BORDER_THICK + c * CELL}
          y={y}
          width={SQ}
          height={SQ}
          fill={cellColor(c + 300, r)}
          rx={1}
        />
      );
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

// ── Certificate type seal (top-right) ────────────────────────────────────────
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
  const R = 44; // radius of outer circle
  const cx = R + 4;
  const cy = R + 4;
  const size = (R + 4) * 2;

  // Arc text "CERTIFICATE" on top
  const arcR = R - 5;
  const chars = 'CERTIFICATE'.split('');
  const totalAngle = 160; // degrees
  const startAngle = -90 - totalAngle / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={R} fill={bg} stroke={ring} strokeWidth={3} />
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={R - 8} fill="none" stroke={ring} strokeWidth={1} strokeDasharray="4 3" />
      {/* Main type label */}
      <text
        x={cx}
        y={cy + 6}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={display.length > 9 ? 9 : 11}
        fontWeight="900"
        fill={text}
        letterSpacing={1}
      >
        {display}
      </text>
      {/* Arc "CERTIFICATE" text */}
      {chars.map((ch, i) => {
        const angle = startAngle + (totalAngle / (chars.length - 1)) * i;
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
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={7}
            fontWeight="700"
            fill={text}
            transform={`rotate(${rotate}, ${x}, ${y})`}
          >
            {ch}
          </text>
        );
      })}
    </svg>
  );
}

// ── Main Certificate ──────────────────────────────────────────────────────────
export default function Certificate({ data, scale = 1, id = 'certificate-render' }: Props) {
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

  // Padding inside the pixel border + teal line
  const PAD = BORDER_THICK + 10; // 46px

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
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Pixel mosaic border */}
      <PixelBorder />

      {/* Teal inner border line */}
      <div
        style={{
          position: 'absolute',
          inset: BORDER_THICK,
          border: '2px solid #00B0BE',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          inset: PAD,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px 30px 10px',
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}
        >
          {/* Smart Africa logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/smart-africa.svg"
            alt="Smart Africa"
            style={{ height: 68, objectFit: 'contain' }}
          />

          {/* Right: SADA logo + seal stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/sada.svg"
              alt="Smart Africa Digital Academy"
              style={{ height: 42, objectFit: 'contain' }}
            />
            <CertSeal
              label={sealLabel}
              customLabel={data.customTypeLabel}
              type={data.type}
            />
          </div>
        </div>

        {/* ── PRESENTED TO ── */}
        <div
          style={{
            fontSize: 17,
            fontWeight: 900,
            color: '#1a1a1a',
            letterSpacing: 1,
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          {ui.presentedTo}
        </div>

        {/* ── RECIPIENT NAME ── */}
        <div
          style={{
            fontSize: data.recipientName.length > 35 ? 28 : 34,
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#1a1a1a',
            textAlign: 'center',
            lineHeight: 1.2,
            paddingBottom: 6,
            borderBottom: '1.5px solid #999',
            width: '80%',
            marginBottom: 14,
          }}
        >
          {data.recipientName || 'Nom du Bénéficiaire'}
        </div>

        {/* Recipient title */}
        {data.recipientTitle && (
          <div style={{ fontSize: 12, color: '#555', fontStyle: 'italic', marginBottom: 8 }}>
            {data.recipientTitle}
          </div>
        )}

        {/* ── INTRO TEXT ── */}
        {data.introText && (
          <div
            style={{
              fontSize: 14,
              color: '#333',
              textAlign: 'center',
              lineHeight: 1.6,
              marginBottom: 6,
            }}
          >
            {data.introText}
          </div>
        )}

        {/* ── SUBJECT / COURSE NAME ── */}
        {data.subjectName && (
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#1a1a1a',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            {data.subjectName}
          </div>
        )}

        {/* ── DATE ── */}
        {data.showDate && data.date && (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#444', marginBottom: 4 }}>
            <div style={{ color: '#666', fontSize: 12 }}>{ui.issuedOn}</div>
            <div style={{ fontWeight: 600 }}>{formatDate(data.date)}</div>
          </div>
        )}

        {/* Certificate number */}
        {data.showCertificateNumber && data.certificateNumber && (
          <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
            N° {data.certificateNumber}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* ── BOTTOM ROW ── */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          {/* Signatories */}
          <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end' }}>
            {data.signatories.map((sig) => (
              <div key={sig.id} style={{ minWidth: 130 }}>
                {/* Signature image */}
                {sig.signature ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sig.signature}
                    alt="Signature"
                    style={{ height: 44, objectFit: 'contain', display: 'block', marginBottom: 2 }}
                  />
                ) : (
                  <div style={{ height: 44 }} />
                )}
                <div style={{ borderTop: '1.5px solid #333', paddingTop: 3 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>{sig.name}</div>
                  <div style={{ fontSize: 10, fontStyle: 'italic', color: '#555' }}>{sig.title}</div>
                  <div style={{ fontSize: 10, color: '#666' }}>{sig.organization}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Partner logos */}
          {data.partnerLogos.length > 0 && (
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {data.partnerLogos.map((logo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={logo.id}
                  src={logo.url}
                  alt={logo.name}
                  style={{ height: 40, objectFit: 'contain', maxWidth: 100 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
