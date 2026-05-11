import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SADA – Générateur de Certificats",
  description:
    "Smart Africa Digital Academy – Générateur officiel de certificats de formation, reconnaissance, partenariat et excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
