// src/pages/admin/ChatsPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getChats, getChatFull } from "../../api/chats";
import type { Chat, ChatFull } from "../../types/chat";
import Modal from "../../components/Modal";

const POLL_MS = Number(import.meta.env.VITE_CHATS_POLL_MS ?? 5000);

type FullCache = Record<number, ChatFull | undefined>;

export default function ChatsPage(): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  // cache de chats completos para previews / búsqueda / modal
  const [fullCache, setFullCache] = useState<FullCache>({});
  const fetchingFull = useRef<Set<number>>(new Set());

  // modal
  const [openId, setOpenId] = useState<number | null>(null);

  // búsqueda
  const [query, setQuery] = useState<string>("");
  const [debounced, setDebounced] = useState<string>("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  // helpers
  function sortByLastActivity(list: Chat[]) {
    return [...list].sort((a, b) => {
      const da = new Date(a.last_activity).getTime();
      const db = new Date(b.last_activity).getTime();
      return db - da;
    });
  }

  async function loadChats() {
    try {
      setErr(null);
      const list = await getChats();
      setChats(sortByLastActivity(list));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error cargando chats");
    }
  }

  // initial + polling
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      await loadChats();
      if (!cancel) setLoading(false);
    })();
    const iv = setInterval(() => {
      if (document.hidden) return;
      loadChats();
    }, POLL_MS);
    const onFocus = () => loadChats();
    window.addEventListener("focus", onFocus);
    return () => {
      cancel = true;
      clearInterval(iv);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // ensureFull: carga y cachea /chats/:id/full si no está
  async function ensureFull(chatId: number): Promise<ChatFull | undefined> {
    if (fullCache[chatId]) return fullCache[chatId];
    if (fetchingFull.current.has(chatId)) return undefined;
    try {
      fetchingFull.current.add(chatId);
      const full = await getChatFull(chatId);
      setFullCache((prev) => ({ ...prev, [chatId]: full }));
      return full;
    } catch {
      // swallow
      return undefined;
    } finally {
      fetchingFull.current.delete(chatId);
    }
  }

  // filtrar por query: primero por peer (tel/email) y last_message;
  // si no coincide, intentamos buscar en mensajes (cargando full lazy si hace falta)
  const filteredChats = useMemo(() => {
    const q = debounced.toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => {
      const peer = (c.phone_number || c.email || "").toLowerCase();
      const last = (c.last_message || "").toLowerCase();
      return peer.includes(q) || last.includes(q) || includesInFull(fullCache[c.id], q);
    });
  }, [chats, debounced, fullCache]);

  // cuando hay query y no hay match por peer/last, intentamos cargar full para buscar por contenido
  useEffect(() => {
    const q = debounced.toLowerCase();
    if (!q) return;
    const candidates = chats.filter((c) => {
      const peer = (c.phone_number || c.email || "").toLowerCase();
      const last = (c.last_message || "").toLowerCase();
      return !peer.includes(q) && !last.includes(q) && !includesInFull(fullCache[c.id], q);
    });
    // cargar en background (limitamos a 6 por ráfaga)
    candidates.slice(0, 6).forEach((c) => { void ensureFull(c.id); });
  }, [debounced, chats, fullCache]);

  // abrir modal con full
  async function handleOpen(chatId: number) {
    setOpenId(chatId);
    await ensureFull(chatId);
  }
  function handleClose() {
    setOpenId(null);
  }

  const openChat = openId != null ? fullCache[openId] : undefined;

  return (
    <div>
      <h2 className="text-2xl font-bold">Chats</h2>
      <p className="mt-2 text-gray-600">Actualiza en tiempo real (polling {POLL_MS}ms).</p>

      {/* barra de búsqueda */}
      <div className="mt-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por teléfono, email o texto del chat…"
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {err && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      {loading && <div className="mt-4 text-sm text-gray-600">Cargando…</div>}

      {/* UNA sola columna de tarjetas compactas */}
      <div className="mt-6 space-y-2">
        {filteredChats.length === 0 ? (
          <div className="text-sm text-gray-600">Sin chats.</div>
        ) : (
          filteredChats.map((c) => (
            <ChatRow
              key={c.id}
              chat={c}
              full={fullCache[c.id]}
              requestFull={() => ensureFull(c.id)}
              onOpen={() => handleOpen(c.id)}
            />
          ))
        )}
      </div>

      {/* Modal con conversación completa */}
      <Modal
        open={openId != null}
        onClose={handleClose}
        title={openChat ? titleFor(openChat) : openId ? `Chat #${openId}` : "Chat"}
        maxWidthClass="max-w-4xl"
      >
        {openId != null ? (
          openChat ? (
            <FullConversation chat={openChat} />
          ) : (
            <div className="text-sm text-gray-600">Cargando conversación…</div>
          )
        ) : null}
      </Modal>
    </div>
  );
}

// ---------- Row compacto estilo WhatsApp/Telegram ----------
function ChatRow({
  chat,
  full,
  requestFull,
  onOpen,
}: {
  chat: Chat;
  full?: ChatFull;
  requestFull: () => Promise<ChatFull | undefined>;
  onOpen: () => void;
}) {
  const [preview, setPreview] = useState<string>(chat.last_message ?? "");
  const [convTime, setConvTime] = useState<string>("—");

  // Si no hay last_message, intentamos obtenerlo del full en segundo plano
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (chat.last_message && chat.last_message.trim() !== "") {
        setPreview(chat.last_message);
      } else {
        const f = full ?? (await requestFull());
        if (cancelled) return;
        const lastBody = lastMessageBody(f);
        if (lastBody) setPreview(lastBody);
      }
      // calcular tiempo total si tenemos full
      const f2 = full ?? (await requestFull());
      if (!cancelled && f2) {
        const t = conversationDuration(f2);
        if (t) setConvTime(t);
      }
    }
    void run();
    return () => { cancelled = true; };
  }, [chat.id, chat.last_message, full, requestFull]);

  const subtitle = preview || "(sin mensajes)";

  return (
    <div className="w-full rounded-xl border bg-white hover:bg-gray-50 transition shadow-sm px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium truncate">{titleFor(chat)}</span>
            <span className="text-xs text-gray-500">{formatDate(chat.last_activity)}</span>
          </div>
          <div className="text-sm text-gray-600 truncate">{subtitle}</div>
          <div className="mt-1 text-xs text-gray-500">Tiempo total: {convTime}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => alert("Escribir: próximamente")}
            className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-100"
            title="Escribir"
          >
            Escribir
          </button>
          <button
            onClick={onOpen}
            className="rounded-lg bg-black px-2 py-1 text-xs text-white hover:opacity-90"
            title="Ver conversación"
          >
            Ver conversación
          </button>
          <button
            onClick={() => alert("Exportar PDF: próximamente")}
            className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-100"
            title="Exportar en PDF"
          >
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Modal: conversación completa ----------
function FullConversation({ chat }: { chat: ChatFull }) {
  return (
    <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
      {chat.messages.length === 0 ? (
        <div className="text-sm text-gray-600">Sin mensajes.</div>
      ) : (
        chat.messages.map((m) => (
          <div key={m.id} className={["flex", m.sender === "user" ? "justify-end" : "justify-start"].join(" ")}>
            <div
              className={[
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                m.sender === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-800",
              ].join(" ")}
            >
              <div className="opacity-70 text-[11px] mb-0.5">
                {m.sender === "user" ? "Usuario" : "Bot"} · {formatDate(m.created_at)}
              </div>
              <div>{m.body}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ---------- Helpers ----------
function titleFor(c: { phone_number: string | null; email: string | null }) {
  return c.phone_number ? c.phone_number : c.email ?? "-";
}
function lastMessageBody(full?: ChatFull): string | "" {
  if (!full || !full.messages?.length) return "";
  return full.messages[full.messages.length - 1]?.body ?? "";
}
function includesInFull(full: ChatFull | undefined, q: string): boolean {
  if (!full || !q) return false;
  return full.messages.some((m) => (m.body || "").toLowerCase().includes(q));
}
function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString();
  } catch {
    return String(iso);
  }
}
function conversationDuration(full: ChatFull | undefined): string | null {
  if (!full || !full.messages?.length) return null;
  const first = new Date(full.messages[0].created_at).getTime();
  const last = new Date(full.messages[full.messages.length - 1].created_at).getTime();
  if (Number.isNaN(first) || Number.isNaN(last)) return null;
  const ms = Math.max(0, last - first);
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}
