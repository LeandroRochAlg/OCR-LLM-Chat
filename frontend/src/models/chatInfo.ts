export type ChatInfo = {
  id: string;
  message: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  documents: Document[];
  interactions: Interaction[];
}

export type Document = {
  id: string;
  title: string;
  url: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
}

export type Interaction = {
  id: string;
  query: string;
  response: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
}