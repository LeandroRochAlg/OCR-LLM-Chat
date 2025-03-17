import ChatContent from "@/components/chat/ChatContent";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Chat',
  };
}

export default async function Chat() {
  return (
    <div className="bg-base-200 h-screen overflow-y-hidden">
      <h2 className="text-4xl text-center my-4">Chat</h2>
      <ChatContent />
    </div>
  );
}