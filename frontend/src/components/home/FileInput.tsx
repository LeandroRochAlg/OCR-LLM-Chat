'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

export default function FileInput() {
  const params = useParams();
  const { t } = useTranslation(params?.lng as string);
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      setFile(files[0]);
    }
  }

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log(formData);
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  }

  return (
    <div className="w-full flex justify-center">
      <fieldset className="fieldset fixed mx-auto bottom-2">
        <input
          type="file"
          className="file-input file-input-primary md:w-128"
          disabled={!user}
          accept="image/*,.pdf"
          onChange={handleFileChange}
        />
        <label className="fieldset-label">.jpg, .jpeg, .png, .bmp, .tiff, .pdf</label>
      </fieldset>

      <button className="btn btn-primary" disabled={file === null} onClick={handleUpload}>{t('home.upload.button')}</button>
    </div>
  );
}