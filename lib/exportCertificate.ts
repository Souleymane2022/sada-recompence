'use client';

/**
 * Converts any URL to a Base64 Data URL.
 */
async function urlToBase64(src: string): Promise<string> {
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) return src;
  try {
    const resp = await fetch(src, { cache: 'force-cache' });
    const blob = await resp.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return src; // fallback
  }
}

/**
 * Injects Base64 data into every <img> inside the element, captures it,
 * then restores the original srcs. Uses html-to-image (SVG-based engine)
 * which handles local images reliably.
 */
async function captureElement(elementId: string): Promise<string> {
  const { toPng } = await import('html-to-image');
  const el = document.getElementById(elementId);
  if (!el) throw new Error(`Element #${elementId} not found`);

  // 1. Collect all images and save originals
  const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'));
  const originals = new Map<HTMLImageElement, string>();

  // 2. Convert every image to Base64 and inject into DOM
  await Promise.all(
    imgs.map(async (img) => {
      const originalSrc = img.getAttribute('src') ?? '';
      originals.set(img, originalSrc);
      const b64 = await urlToBase64(img.src || originalSrc);
      img.src = b64;
      img.removeAttribute('crossorigin');
    }),
  );

  // 3. Wait for browser to decode all images
  await Promise.all(
    imgs.map((img) => img.decode().catch(() => Promise.resolve())),
  );

  // 4. Capture with html-to-image (SVG-based, handles embedded images correctly)
  const dataUrl = await toPng(el, {
    width: 1123,
    height: 794,
    pixelRatio: 3,
    style: { transform: 'none' },
    cacheBust: true,
    skipAutoScale: true,
  });

  // 5. Restore original srcs
  originals.forEach((src, img) => {
    img.setAttribute('src', src);
  });

  return dataUrl;
}

export async function exportAsPNG(
  elementId: string,
  filename = 'certificat-sada',
): Promise<void> {
  const dataUrl = await captureElement(elementId);
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportAsPDF(
  elementId: string,
  filename = 'certificat-sada',
): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const dataUrl = await captureElement(elementId);
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
  const safe = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(safe);
}

export async function getPDFBlob(elementId: string): Promise<Blob> {
  const { default: jsPDF } = await import('jspdf');
  const dataUrl = await captureElement(elementId);
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
  return pdf.output('blob');
}
