// src/types/chat.ts
export type Chat = {
  id: number;
  phone_number: string | null;
  email: string | null;
  user_id: number | null;
  last_message: string | null;
  created_at: string;
  last_activity: string;
};

export type ChatMessage = {
  id: number;
  chat_id: number;
  sender: "user" | "bot";
  body: string;
  created_at: string;
};

export type ChatFull = Chat & { messages: ChatMessage[] };
