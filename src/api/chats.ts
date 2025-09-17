// src/api/chats.ts
import { http } from "../lib/http";
import { authHeader } from "./login";
import type { Chat, ChatFull } from "../types/chat";

/**
 * Obtiene todos los chats.
 * Requiere Bearer Token en Authorization.
 */
export async function getChats(): Promise<Chat[]> {
  return http<Chat[]>("/chats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });
}

/**
 * Obtiene el chat completo con mensajes.
 * Requiere Bearer Token en Authorization.
 */
export async function getChatFull(chatId: number): Promise<ChatFull> {
  return http<ChatFull>(`/chats/${chatId}/full`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });
}
