'use client';

export async function exportAsPNG(elementId: string, filename = 'certificat-sada'): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Certificate element not found');

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FDFAF4',
    logging: false,
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function exportAsPDF(elementId: string, filename = 'certificat-sada'): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');
  const { default: jsPDF } = await import('jspdf');
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Certificate element not found');

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FDFAF4',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  // A4 landscape: 297 × 210 mm
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
  pdf.save(`${filename}.pdf`);
}
