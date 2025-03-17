'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useTranslation } from "@/app/i18n/client";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import ErrorMessage from "../feedback/ErrorMessage";
import { ChatInfo } from "@/models/chatInfo";

export default function ChatContent() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation(params?.lng as string);
  const { user, loading } = useAuth();
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user && !loading) {
      router.push(`/${params?.lng}/auth`);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.get('/documents/' + params?.chatId);

        setChatInfo(result.data);
      } catch (error) {
        console.error(error);
        setError(t('chat.errorLoading'));
      }
    };

    fetchData();
  }, [params?.chatId]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto h-[calc(100vh-100px)] mt-0 flex flex-col overflow-auto">
        {chatInfo ? (
          <>        
            <h3 className="text-xl text-center my-5">{chatInfo.documents[0].title}</h3>

            {chatInfo.interactions.map((interaction) => (
              <div key={interaction.id}>
                <div className="chat chat-end">
                  <div className="chat-header">
                    {user?.name}
                  </div>
                  <div key={interaction.id} className="chat-bubble">
                    {interaction.query}
                  </div>
                </div>

                <div className="chat chat-start">
                  <div className="chat-header">
                    AI
                  </div>
                  <div className="chat-bubble">
                    {interaction.response}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="hero">
            <div className="hero-content">
              <span className="loading loading-dots loading-xl"></span>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-2 md:mx-auto md:w-[700px] mx-2 w-full flex items-center justify-center">
        <input type="text" placeholder={t('chat.input.placeholder')} className="input w-full" />
      </div>
      <ErrorMessage msg={error}/>
    </div>
  );
}