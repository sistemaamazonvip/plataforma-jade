import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AmazonVip — Plataforma Interna",
  description: "Plataforma interna da Amazon Vip Viagens e Turismo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}
