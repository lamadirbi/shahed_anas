import type { Metadata, Viewport } from 'next';
import { Amiri, El_Messiri } from 'next/font/google';
import './globals.css';

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-amiri',
  display: 'swap',
});

const elMessiri = El_Messiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-el-messiri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'دعوة زفاف أنس وشهد',
  description: 'ندعوكم لمشاركتنا فرحتنا — أفراح آل حنيف وآل قشطة',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${amiri.variable} ${elMessiri.variable}`}>
        {children}
      </body>
    </html>
  );
}
