'use client';

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User } from "@/models/user";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import ErrorMessage from "../feedback/ErrorMessage";
import SuccessMessage from "../feedback/SuccessMessage";

type GoogleSignInButtonProps = {
  translations: {
    google: string;
    loading: string;
    success: string;
    error: string;
  }
};

export default function GoogleSignInButton({ translations }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();

      const response = await api.post('auth/google', { idToken });

      if (response.status === 201) {
        const user = response.data.user as User;

        localStorage.setItem('token', response.data.token);

        login(user);

        router.push('/');

        setSuccess(translations.success);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(translations.error);
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      console.error(error);
      setError(translations.error);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="btn bg-white text-black border-[#e5e5e5]"
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <span className="text-primary-content flex items-center justify-center gap-2">
            <span className="loading loading-spinner"></span>
            {translations.loading}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg aria-label="Google logo" width="28" height="28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
            {translations.google}
          </span>
        )}
      </button>

      <ErrorMessage msg={error} />
      <SuccessMessage msg={success} />
    </div>
  );
}