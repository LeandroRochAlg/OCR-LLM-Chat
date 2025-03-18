'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
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
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatInfo) {
      scrollToBottom();
    }
  }, [chatInfo?.interactions]);

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

  const handleInteract = async () => {
    if (!message) return;

    try {
      setLoadingResponse(true);

      const query = message;
      setMessage('');

      const result = await api.post('/documents/interact', {
        chatId: params?.chatId,
        message: query,
      });

      // Update the chat info with the new interaction
      setChatInfo((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          interactions: [...prev.interactions, result.data.interaction],
        };
      });

      setError('');
      scrollToBottom();
    } catch (error) {
      console.error(error);
      setError(t('chat.errorInteracting'));
    } finally {
      setLoadingResponse(false);
    }
  }

  const handleDownload = async () => {
    if (!chatInfo?.documents[0]) return;

    try {
      const result = await api.get('/documents/download/' + params?.chatId, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', chatInfo?.documents[0].title);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
      setError(t('chat.errorDownloading'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] mb-10 mt-0 flex flex-col overflow-auto">
        {chatInfo ? (
          <>        
            <div className="chat chat-end">
              <div className="chat-header">
                {user?.name}
              </div>
              <div className="chat-bubble chat-bubble-secondary">
                <button className="btn" onClick={handleDownload}>
                  {chatInfo.documents[0].title.split('.')[0]} <div className="badge badge-sm badge-primary">{chatInfo.documents[0].title.split('.')[1]}</div>
                </button>
              </div>
            </div>

            <div className="chat chat-start">
              <div className="chat-header">
                LLM
              </div>
              <div className="chat-bubble">
                {chatInfo.interactions[0].response}
              </div>
            </div>

            {chatInfo.interactions.slice(1).map((interaction) => (
              <div key={interaction.id}>
                <div className="chat chat-end">
                  <div className="chat-header">
                    {user?.name}
                  </div>
                  <div key={interaction.id} className="chat-bubble chat-bubble-secondary">
                    {interaction.query}
                  </div>
                </div>

                <div className="chat chat-start">
                  <div className="chat-header">
                    LLM
                  </div>
                  <div className="chat-bubble">
                    {interaction.response}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="hero">
            <div className="hero-content">
              <span className="loading loading-dots loading-xl"></span>
            </div>
          </div>
        )}
      </div>

      <form
        className="fixed bottom-2 md:mx-auto md:w-[700px] mx-2 w-full flex items-center justify-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleInteract();
        }}
      >
        <input
          type="text"
          placeholder={t('chat.input.placeholder')}
          className="input w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loadingResponse}
        />

        <button type="submit" className="btn btn-primary" disabled={loadingResponse}>
          {t('chat.input.button')}
        </button>
      </form>

      <ErrorMessage msg={error}/>
    </div>
  );
}