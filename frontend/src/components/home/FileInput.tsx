'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import ErrorMessage from "../feedback/ErrorMessage";

export default function FileInput() {
  const params = useParams();
  const { t } = useTranslation(params?.lng as string);
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

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

    // Show loading modal
    const modal = document.getElementById('my_modal_5') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }

    try {
      const response = await api.post('/documents/upload', formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);

      setError(t('home.upload.error'));
      setTimeout(() => setError(''), 5000);
    } finally {
      // Hide loading modal
      if (modal) {
        modal.close();
      }
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

      {/* Loading modal */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex flex-col items-center p-4 gap-4">
          <h3 className="text-xl">{t('home.upload.uploading')}</h3>
          <progress className="progress w-56"></progress>
        </div>
      </dialog>

      <ErrorMessage msg={error} />
    </div>
  );
}