'use client';

import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import FileInput from "./FileInput";

export default function HomeContent() {
  const params = useParams();
  const { t } = useTranslation(params?.lng as string);
  const { user } = useAuth();

  return (
    <div>
      {user ? (
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold">{t('home.upload.title')}</h1>
            <p className="py-6">
              {t('home.upload.description')}
            </p>
            <p className="py-6 text-xl">
              {t('home.upload.getStarted')}
            </p>
          </div>
        </div>
      ) : (
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">{t('home.title')}</h1>

            <p className="py-6">
              {t('home.description')}
            </p>

            <button className="btn btn-success uppercase"><Link href={`${params.lng}/auth`}>{t('sidebar.preferences.login')}</Link></button>
          </div>
        </div>
      )}

      <FileInput />
    </div>
  );
}