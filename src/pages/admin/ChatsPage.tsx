// src/pages/admin/ChatsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { getChats, getChatFull } from "../../api/chats";
import type { Chat, ChatFull, ChatMessage } from "../../types/chat";
import Modal from "../../components/Modal";

type FullMap = Record<number, ChatFull | undefined>;

export default function ChatsPage(): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [full, setFull] = useState<FullMap>({});

  const [openId, setOpenId] = useState<number | null>(null); // modal

  // Cargar lista de chats y luego cada chat full para tarjetas (últimos 6 msgs)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const list = await getChats();
        if (cancelled) return;
        setChats(list);

        // Obtener full de todos los chats (para mostrar últimos 6 mensajes)
        const fullList = await Promise.all(
          list.map((c) =>
            getChatFull(c.id).catch(() => undefined) // si falla alguno, no rompe todo
          )
        );

        if (cancelled) return;
        const map: FullMap = {};
        for (const cf of fullList) {
          if (cf?.id != null) map[cf.id] = cf;
        }
        setFull(map);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Error cargando chats");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // secciones por teléfono vs email
  const byPhone = useMemo(
    () => chats.filter((c) => c.phone_number && !c.email),
    [chats]
  );
  const byEmail = useMemo(
    () => chats.filter((c) => c.email && !c.phone_number),
    [chats]
  );

  function last6Messages(chatId: number): ChatMessage[] {
    const m = full[chatId]?.messages ?? [];
    return m.slice(-6); // últimos 6
  }

  function openModal(chatId: number) {
    setOpenId(chatId);
  }

  function closeModal() {
    setOpenId(null);
  }

  const openChat = openId != null ? full[openId] : undefined;

  return (
    <div>
      <h2 className="text-2xl font-bold">Chats</h2>
      <p className="mt-2 text-gray-600">Listado de conversaciones del bot.</p>

      {err && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading && <div className="mt-4 text-sm text-gray-600">Cargando…</div>}

      {!loading && !err && (
        <div className="mt-6 space-y-10">
          {/* Sección: Teléfono */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Con número de teléfono</h3>
            {byPhone.length === 0 ? (
              <div className="text-sm text-gray-600">Sin chats por teléfono.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {byPhone.map((c) => (
                  <ChatCard
                    key={c.id}
                    chat={c}
                    last={last6Messages(c.id)}
                    onOpen={() => openModal(c.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Sección: Email */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Con email</h3>
            {byEmail.length === 0 ? (
              <div className="text-sm text-gray-600">Sin chats por email.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {byEmail.map((c) => (
                  <ChatCard
                    key={c.id}
                    chat={c}
                    last={last6Messages(c.id)}
                    onOpen={() => openModal(c.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Modal: conversación completa */}
      <Modal
        open={openId != null && !!openChat}
        onClose={closeModal}
        title={
          openChat
            ? openChat.phone_number
              ? `Chat #${openChat.id} · ${formatPeer(openChat)}`
              : `Chat #${openChat.id} · ${formatPeer(openChat)}`
            : "Chat"
        }
        maxWidthClass="max-w-4xl"
      >
        {openChat ? (
          <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
            {openChat.messages.length === 0 ? (
              <div className="text-sm text-gray-600">Sin mensajes.</div>
            ) : (
              openChat.messages.map((m) => (
                <Bubble key={m.id} msg={m} />
              ))
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-600">Cargando conversación…</div>
        )}
      </Modal>
    </div>
  );
}

/** ---------- Card de chat con últimos 6 mensajes ---------- */

function ChatCard({
  chat,
  last,
  onOpen,
}: {
  chat: Chat;
  last: ChatMessage[];
  onOpen: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">Chat #{chat.id}</p>
          <p className="font-medium truncate">{formatPeer(chat)}</p>
        </div>
        <button
          onClick={onOpen}
          className="rounded-full bg-black px-3 py-1.5 text-xs text-white hover:opacity-90"
        >
          Ver completo
        </button>
      </div>

      <div className="p-4 space-y-2">
        {last.length === 0 ? (
          <div className="text-sm text-gray-600">Sin mensajes.</div>
        ) : (
          last.map((m) => <Bubble key={m.id} msg={m} compact />)
        )}
      </div>

      <div className="px-4 py-2 border-t text-xs text-gray-500 flex justify-between">
        <span>Creado: {formatDate(chat.created_at)}</span>
        <span>Última actividad: {formatDate(chat.last_activity)}</span>
      </div>
    </div>
  );
}

/** ---------- Burbuja mensaje ---------- */

function Bubble({
  msg,
  compact = false,
}: {
  msg: ChatMessage;
  compact?: boolean;
}) {
  const isUser = msg.sender === "user";
  return (
    <div
      className={[
        "flex",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
          isUser
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-800",
          compact ? "py-1" : "",
        ].join(" ")}
      >
        <div className="opacity-70 text-[11px] mb-0.5">
          {isUser ? "Usuario" : "Bot"} · {formatDate(msg.created_at)}
        </div>
        <div>{msg.body}</div>
      </div>
    </div>
  );
}

/** ---------- Helpers ---------- */

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    // formateo corto local
    return d.toLocaleString();
  } catch {
    return String(iso);
  }
}

function formatPeer(c: { phone_number: string | null; email: string | null }): string {
  return c.phone_number ? c.phone_number : c.email ?? "-";
}
