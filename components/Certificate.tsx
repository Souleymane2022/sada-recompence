'use client';

import React from 'react';
import { CertificateData, TYPE_LABELS, UI_LABELS } from '@/types/certificate';

interface Props {
  data: CertificateData;
  scale?: number;
  id?: string;
}

// A4 landscape at 96dpi
const CERT_W = 1123;
const CERT_H = 794;

export default function Certificate({ data, scale = 1, id = 'certificate-render' }: Props) {
  const lang = data.language;
  const ui = UI_LABELS[lang];
  const typeLabel =
    data.type === 'custom'
      ? data.customTypeLabel.toUpperCase()
      : TYPE_LABELS[data.type][lang];

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
        width: CERT_W,
        height: CERT_H,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        position: 'relative',
        backgroundColor: '#FDFAF4',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      {/* Background watermark – Africa map */}
      <AfricaWatermark />

      {/* Outer border */}
      <div
        style={{
          position: 'absolute',
          inset: 10,
          border: '4px solid #C8A84B',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />
      {/* Inner border */}
      <div
        style={{
          position: 'absolute',
          inset: 18,
          border: '1.5px solid #C8A84B',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />

      {/* Corner ornaments */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <CornerOrnament key={pos} position={pos} />
      ))}

      {/* Main content area */}
      <div
        style={{
          position: 'absolute',
          inset: 28,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '14px 50px 10px',
          gap: 0,
        }}
      >
        {/* ── HEADER: logos + title ── */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          {/* Smart Africa logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/smart-africa.svg"
            alt="Smart Africa"
            style={{ height: 58, objectFit: 'contain' }}
          />

          {/* Central title */}
          <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
            {/* Ornament */}
            <div style={{ color: '#C8A84B', fontSize: 16, letterSpacing: 8, marginBottom: 2 }}>
              ✦ ✦ ✦
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: '#0D2E5A',
                letterSpacing: 10,
                lineHeight: 1,
                fontFamily: '"Georgia", serif',
                textTransform: 'uppercase',
              }}
            >
              {ui.certTitle}
            </div>
          </div>

          {/* SADA logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/sada.svg"
            alt="Smart Africa Digital Academy"
            style={{ height: 58, objectFit: 'contain' }}
          />
        </div>

        {/* ── GOLD DIVIDER ── */}
        <GoldDivider width="100%" />

        {/* ── CERTIFICATE TYPE ── */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#C8A84B',
            letterSpacing: 6,
            marginTop: 10,
            marginBottom: 6,
            textAlign: 'center',
            fontFamily: '"Georgia", serif',
          }}
        >
          {typeLabel}
        </div>

        {/* ── AWARDED TO ── */}
        <div
          style={{
            fontSize: 12,
            color: '#6B5A3A',
            fontStyle: 'italic',
            letterSpacing: 3,
            marginBottom: 6,
          }}
        >
          {ui.awardedTo}
        </div>

        {/* ── RECIPIENT NAME ── */}
        <div
          style={{
            fontSize: data.recipientName.length > 30 ? 34 : 42,
            fontWeight: 700,
            color: '#0D2E5A',
            textAlign: 'center',
            lineHeight: 1.15,
            fontFamily: '"Georgia", serif',
            fontStyle: 'italic',
            letterSpacing: 1,
          }}
        >
          {data.recipientName || 'Nom du Bénéficiaire'}
        </div>

        {/* Recipient title */}
        {data.recipientTitle && (
          <div
            style={{
              fontSize: 12,
              color: '#555',
              fontStyle: 'italic',
              marginTop: 4,
              letterSpacing: 1,
            }}
          >
            {data.recipientTitle}
          </div>
        )}

        {/* ── BODY TEXT ── */}
        <div
          style={{
            fontSize: 13,
            color: '#333',
            textAlign: 'center',
            lineHeight: 1.75,
            maxWidth: 720,
            marginTop: 10,
            marginBottom: 8,
            fontFamily: '"Georgia", serif',
          }}
        >
          {data.bodyText}
        </div>

        {/* ── SMALL GOLD DIVIDER ── */}
        <GoldDivider width="55%" />

        {/* ── BOTTOM ROW: date/number + signatures ── */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 10,
            flex: 1,
          }}
        >
          {/* Left – date / cert number */}
          <div style={{ fontSize: 11, color: '#555', minWidth: 160 }}>
            {data.showDate && data.date && (
              <div>
                <span style={{ fontStyle: 'italic' }}>{data.city && `${data.city}, `}</span>
                <span style={{ fontStyle: 'italic' }}>{formatDate(data.date)}</span>
              </div>
            )}
            {data.showCertificateNumber && data.certificateNumber && (
              <div style={{ marginTop: 4, color: '#888', fontSize: 10 }}>
                {ui.certNumber} {data.certificateNumber}
              </div>
            )}
          </div>

          {/* Center – partner logos */}
          {data.partnerLogos.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {data.partnerLogos.map((logo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={logo.id}
                  src={logo.url}
                  alt={logo.name}
                  style={{ height: 38, objectFit: 'contain', maxWidth: 90 }}
                />
              ))}
            </div>
          )}

          {/* Right – signatories */}
          <div style={{ display: 'flex', gap: 50, alignItems: 'flex-end' }}>
            {data.signatories.map((sig) => (
              <div key={sig.id} style={{ textAlign: 'center', minWidth: 130 }}>
                {sig.signature ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sig.signature}
                    alt="Signature"
                    style={{ height: 46, marginBottom: 2, objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ height: 46, marginBottom: 2 }} />
                )}
                <div
                  style={{
                    borderTop: '1.5px solid #C8A84B',
                    paddingTop: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#0D2E5A',
                      fontFamily: '"Georgia", serif',
                    }}
                  >
                    {sig.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#666', fontStyle: 'italic' }}>
                    {sig.title}
                  </div>
                  <div style={{ fontSize: 10, color: '#888' }}>{sig.organization}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────

function GoldDivider({ width }: { width: string }) {
  return (
    <div
      style={{
        width,
        height: 1.5,
        background: 'linear-gradient(to right, transparent 0%, #C8A84B 20%, #C8A84B 80%, transparent 100%)',
        margin: '4px 0',
        flexShrink: 0,
      }}
    />
  );
}

type Corner = 'tl' | 'tr' | 'bl' | 'br';
function CornerOrnament({ position }: { position: Corner }) {
  const size = 32;
  const offset = 5;
  const pos: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
  };

  const coords: Record<Corner, React.CSSProperties> = {
    tl: { top: offset, left: offset },
    tr: { top: offset, right: offset },
    bl: { bottom: offset, left: offset },
    br: { bottom: offset, right: offset },
  };

  const rotations: Record<Corner, number> = { tl: 0, tr: 90, bl: 270, br: 180 };

  return (
    <svg
      style={{ ...pos, ...coords[position], transform: `rotate(${rotations[position]}deg)` }}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 4 L4 14 M4 4 L14 4" stroke="#C8A84B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4" cy="4" r="2.5" fill="#C8A84B" />
      <circle cx="16" cy="16" r="1.5" fill="#C8A84B" opacity="0.5" />
    </svg>
  );
}

function AfricaWatermark() {
  return (
    <svg
      style={{
        position: 'absolute',
        right: 40,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 280,
        height: 340,
        opacity: 0.04,
        pointerEvents: 'none',
      }}
      viewBox="0 0 200 250"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 100,8 C 115,8 130,12 142,20 C 154,28 162,40 165,53 C 168,66 163,77 167,89 C 171,101 180,109 180,122 C 180,135 171,145 167,157 C 163,169 163,181 156,191 C 149,201 138,207 128,213 C 118,219 108,222 98,224 C 88,226 78,224 68,218 C 58,212 50,203 44,193 C 38,183 35,172 34,160 C 33,148 36,136 34,124 C 32,112 26,102 26,90 C 26,78 32,68 34,56 C 36,44 33,33 38,23 C 43,13 53,8 66,6 C 78,4 90,6 100,8 Z M 155,52 C 162,45 172,43 176,50 C 178,55 173,62 167,65 C 162,60 157,56 155,52 Z"
        fill="#0D2E5A"
      />
    </svg>
  );
}
