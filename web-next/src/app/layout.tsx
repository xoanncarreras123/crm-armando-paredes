import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/presentation/providers/AuthProvider";
import { PrefsProvider } from "@/presentation/providers/PrefsProvider";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Armando Paredes · CRM",
  description: "CRM Inmobiliario — Armando Paredes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark" className={`${syne.variable} ${dmSans.variable} h-full`}>
      <body className="h-full antialiased" style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}>
        <AuthProvider>
          <PrefsProvider>
            {children}
          </PrefsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
