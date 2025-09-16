// src/api/agent.ts
import { http } from "../lib/http";
import { getStoredAuth } from "./login";

/** ===== Chats ===== */
export type CreateChatPayload = {
  phone_number?: string | null;
  email?: string | null;
  user_id?: number | null;
};

export type ChatResponse = {
  id: number;
  phone_number: string | null;
  email: string | null;
  user_id: number | null;
  last_message?: string | null;
  created_at?: string;
  last_activity?: string;
};

const CHAT_ID_KEY = "chat_id";

/** Obtiene el chat_id de localStorage (si está) */
export function getCachedChatId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CHAT_ID_KEY);
  const id = raw ? Number(raw) : NaN;
  return Number.isFinite(id) && id > 0 ? id : null;
}

/** Guarda el chat_id en localStorage */
export function cacheChatId(id: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_ID_KEY, String(id));
}

/** Crea un chat en el backend */
export async function createChat(): Promise<ChatResponse> {
  const auth = getStoredAuth();
  const payload: CreateChatPayload = {
    email: auth.user?.email ?? null,
    user_id: auth.user?.id ?? null,
    // si algún día quieres usar whatsapp, puedes pasar phone_number aquí
  };

  const chat = await http<ChatResponse>("/chats", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  cacheChatId(chat.id);
  return chat;
}

/** Devuelve un ChatResponse si ya existe en cache, o crea uno nuevo */
export async function createOrLoadChat(): Promise<ChatResponse> {
  const cached = getCachedChatId();
  if (cached) {
    return {
      id: cached,
      phone_number: null,
      email: getStoredAuth().user?.email ?? null,
      user_id: getStoredAuth().user?.id ?? null,
      last_message: null,
      created_at: undefined,
      last_activity: undefined,
    };
  }
  return await createChat();
}

/** Garantiza que exista un chat_id (lo crea si no existe) y lo retorna */
export async function ensureChatId(): Promise<number> {
  const cached = getCachedChatId();
  if (cached) return cached;
  const chat = await createChat();
  return chat.id;
}

/** ===== Agente ===== */
export type AgentProcessPayload = {
  message: string;
  bot_type: "web_chat_bot" | "whatsapp_bot" | "telegram_bot";
  chat_id: number;
  user_id?: number | null;
  save_to_chat?: boolean;
  context?: Record<string, unknown>;
};

/** Respuesta del backend (según tu Postman) */
export type ProductSuggestion = {
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: string;
  score: number;
};

export type CostWindow = {
  current: number;
  limit: number;
  exceeded: boolean;
  percentage: number;
};

export type CostLimits = {
  daily: CostWindow;
  monthly: CostWindow;
};

export type AgentProcessBackendResponse = {
  chat_id: number;
  user_id: number | null;
  bot_type: "web_chat_bot" | "whatsapp_bot" | "telegram_bot";
  message: string;
  intent: string | null;
  confidence: number;
  detected_keywords: string[];
  response_type: string;
  timestamp: string;
  processing_steps: string[];
  response: string;
  agent_used: string;
  requires_agent: boolean;
  cost: number;
  model_used: string;
  response_time: number;
  products?: ProductSuggestion[];
  context_used: boolean;
  success: boolean;
  total_processing_time: number;
  cost_limits: CostLimits;
};

/** Respuesta normalizada para el UI */
export type AgentMessagePart =
  | { type: "text"; content: string }
  | { type: "product"; content: ProductSuggestion }
  | { type: "meta"; content: Record<string, unknown> };

export type AgentProcessResponse = {
  ok: boolean;
  reply: string;
  messages: AgentMessagePart[];
  meta: {
    intent: string | null;
    confidence: number;
    agent_used: string;
    model_used: string;
    response_time: number;
    total_processing_time: number;
    processing_steps: string[];
    cost_limits: CostLimits;
    raw: AgentProcessBackendResponse;
  };
};

/** Envía al backend y normaliza la respuesta */
export async function sendToAgent(payload: AgentProcessPayload): Promise<AgentProcessResponse> {
  const raw = await http<AgentProcessBackendResponse>("/ai-agent/process", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const reply = raw.response ?? "";
  const parts: AgentMessagePart[] = [{ type: "text", content: reply }];

  if (Array.isArray(raw.products)) {
    for (const p of raw.products) parts.push({ type: "product", content: p });
  }

  return {
    ok: raw.success === true,
    reply,
    messages: parts,
    meta: {
      intent: raw.intent,
      confidence: raw.confidence,
      agent_used: raw.agent_used,
      model_used: raw.model_used,
      response_time: raw.response_time,
      total_processing_time: raw.total_processing_time,
      processing_steps: raw.processing_steps,
      cost_limits: raw.cost_limits,
      raw,
    },
  };
}
