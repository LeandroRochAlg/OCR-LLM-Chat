'use client';

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export default function LanguageController({ languageTranslation, lng }: { languageTranslation: string, lng: string }) {
  const router = useRouter();
  const pathName = usePathname();

  const switchLanguage = useCallback((newLng: string) => {
    const pathWithoutLng = pathName.replace(`/${lng}`, '');
    router.push(`/${newLng}${pathWithoutLng}`);
  }, [lng]);

  return (
    <details>
      <summary>{languageTranslation}</summary>

      <ul>
        <li>
          <button className={lng === 'en-US' ? 'font-bold' : ''} onClick={() => switchLanguage('en-US')}>English</button>
        </li>
        <li>
          <button className={lng === 'es' ? 'font-bold' : ''} onClick={() => switchLanguage('es')}>Español</button>
        </li>
        <li>
          <button className={lng === 'pt-BR' ? 'font-bold' : ''} onClick={() => switchLanguage('pt-BR')}>Português</button>
        </li>
      </ul>
    </details>
  )
}