import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TDV E-School — Təhsil, İmtahan və AI Analitika Portalı",
  description:
    "TDV BTL Məktəb-Lisey Kompleksinin rəsmi elektron təhsil platforması. Dərslər, BSQ/KSQ imtahan simulyatoru və AI bələdçi.",
  icons: {
    icon: "/assets/tdv-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className="dark">
      <body className="min-h-screen bg-[#050505] text-zinc-100 antialiased selection:bg-purple-500/30 selection:text-purple-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
