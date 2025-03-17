import { ReactNode } from 'react';
import { languages } from '../i18n/settings';
import { dir } from 'i18next';
import "./globals.css";
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { getTranslation } from '../i18n/server';
import UserPreferences from '@/components/sidebar/UserPreferences';
import Link from 'next/link';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const { t } = await getTranslation(lng);

  const preferencesTranslations = {
    title: t('sidebar.preferences.title'),
    theme: t('sidebar.preferences.theme'),
    language: t('sidebar.preferences.language'),
    login: t('sidebar.preferences.login'),
    logout: t('sidebar.preferences.logout'),
    lng,
  };

  return (
    <html lang={lng} dir={dir(lng)}>
      <body className='antialiased bg-base-200'>
        <AuthProvider>
          <ThemeProvider>
            <div className="drawer">
              <input id="my-drawer" type="checkbox" className="drawer-toggle fixed" />
              <div className="drawer-content">
                <label htmlFor="my-drawer" className="btn btn-primary drawer-button absolute top-5 left-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-6 w-6 stroke-current">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </label>
                {/* Page content here */}
                {children}
              </div>
              <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className='menu bg-base-200 text-base-content min-h-full w-80 p-5'>
                  <h2 className='text-xl text-bold'>OCR-LLM-Chat</h2>

                  <button className='text-lg my-4 text-left btn btn-ghost'>
                    <Link href={`/${lng}/`}>{t('sidebar.newChat')}</Link>
                  </button>

                  <div className='fixed bottom-0 left-0 w-full'>
                    <UserPreferences translations={preferencesTranslations} />
                  </div>
                </div>
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}