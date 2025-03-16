'use client';

import { useAuth } from "@/contexts/AuthContext";
import ThemeController from "./ThemeController";
import LanguageController from "./LanguageController";
import Link from "next/link";

type UserPreferencesProps = {
  translations: {
    title: string;
    theme: string;
    language: string;
    login: string;
    logout: string;
    lng: string;
  };
}

export default function UserPreferences({ translations }: UserPreferencesProps) {
  const { user, logout } = useAuth();

  return (
    <div className="dropdown dropdown-top my-5 mx-3 w-74">
      <div tabIndex={0} role="button" className="btn m-1 flex items-center">
        {user ? (
          <div className="flex items-center px-6">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
            <span className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap">{user.name}</span>
          </div>
        ) : (
          <span className="text-lg">{translations.title}</span>
        )}
      </div>

      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        <li>
           <ThemeController themeTranslation={translations.theme} />
        </li>

        <li>
          <LanguageController languageTranslation={translations.language} lng={translations.lng} />
        </li>

        <li>
          {user ? (
            <button onClick={logout} className="mt-3 btn btn-error h-8">{translations.logout}</button>
          ) : (
            <button className="mt-3 btn btn-success h-8">
              <Link href={`/${translations.lng}/auth`}>{translations.login}</Link>
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}