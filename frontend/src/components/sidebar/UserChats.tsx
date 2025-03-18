'use client';

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import Link from "next/link";

type Chat = {
  id: string;
  documents: {
    title: string;
  }[];
}

export default function UserChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const { user, loading } = useAuth();
  const lng = useParams().lng;
  const pathname = usePathname();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoadingChats(false);
        return;
      }
      
      try {
        const result = await api.get('/documents/chats');

        setChats(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchData();
  }, [user, pathname]);

  if (!user && !loading) {
    return null;
  }

  return (
    <div className="mb-4">
      {loadingChats ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>
              <Link href={`/${lng}/chat/${chat.id}`}><p>{chat.documents[0].title}</p></Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}