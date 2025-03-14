import { ReactNode } from 'react';
import { languages } from '../i18n/settings';
import { dir } from 'i18next';
import "./globals.css";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { lng: string };
}) {
  const { lng } = await params;

  return (
    <html lang={lng} dir={dir(lng)}>
      <body className='antialiased'>
        {children}
      </body>
    </html>
  );
}