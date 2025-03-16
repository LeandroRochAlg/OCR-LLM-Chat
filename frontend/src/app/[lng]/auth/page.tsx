import { getTranslation } from "@/app/i18n/server";
import { Metadata } from "next";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getTranslation(lng);
  return {
    title: t('auth.title'),
    description: t('auth.description'),
  };
}

export default async function Auth({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;
  const { t } = await getTranslation(lng);

  const buttonTranslations = {
    google: t('auth.signIn.google'),
    loading: t('auth.signIn.loading'),
    success: t('auth.signIn.success'),
    error: t('auth.signIn.error'),
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">{t('auth.title')}</h1>
          <p className="py-6">
            {t('auth.description')}
          </p>
          <GoogleSignInButton translations={buttonTranslations}/>
        </div>
      </div>
    </div>
  );
}