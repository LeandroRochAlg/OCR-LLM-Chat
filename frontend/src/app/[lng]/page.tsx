import { getTranslation } from '../i18n/server';
import { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getTranslation(lng);
  return {
    title: t('home.title'),
    description: t('home.description'),
  };
}

export default async function Home() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <HomeContent />
    </div>
  );
}