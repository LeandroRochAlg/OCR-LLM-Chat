import { useTranslation } from '../i18n/server';

export default async function Home({ params }: { params: { lng: string } }) {
  const { lng } = await params;
  const { t } = await useTranslation(lng);

  return (
    <div>
      <h1 className='text-3xl font-bold text-center mt-5'>{t('welcome')}</h1>
    </div>
  );
}