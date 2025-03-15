'use client';

import { useTranslation } from '../i18n/client';
import { useAuth } from '../../contexts/AuthContext';
import { useParams } from 'next/navigation';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

export default function Home() {
  const params = useParams();
  const lng = params?.lng as string;
  const { t } = useTranslation(lng);
  const { user, loading } = useAuth();

  const buttonTranslations = {
    google: t('auth.signIn.google'),
    loading: t('auth.signIn.loading'),
    success: t('auth.signIn.success'),
    error: t('auth.signIn.error'),
  };

  return (
    <div>
      <h1 className='text-3xl font-bold text-center mt-5'>{t('welcome')}</h1>
      
      {loading ? (
        <p>{t('loading')}</p>
      ) : user ? (
        <p>{t('email')}: {user.email}</p>
      ) : (
        <GoogleSignInButton translations={buttonTranslations}/>
      )}
    </div>
  );
}