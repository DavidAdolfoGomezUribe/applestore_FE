import React, { useState, useRef, useEffect } from 'react';
import { createOrLoadChat, ensureChatId, sendToAgent, getCachedChatId } from '../api/agent';
import { getStoredAuth } from '../api/login';
import { useNavigate } from 'react-router-dom';

type Message = { role: 'user' | 'bot' | 'system'; text: string };

export default function FloatingChat(): React.ReactElement {
  const navigate = useNavigate();

  // Estado de autenticación (se actualiza al abrir el chat)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const { user } = getStoredAuth();
    return Boolean(user?.email);
  });

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '¡Hola! Soy tu asistente de la tienda. ¿En qué puedo ayudarte hoy?' }
  ]);

  // chatId solo si hay sesión; si no, evitamos su creación
  const [chatId, setChatId] = useState<number | null>(getCachedChatId());
  const endRef = useRef<HTMLDivElement | null>(null);

  // ---- Tooltip (mensaje en bucle) sobre el botón cuando NO hay sesión ----
  const promoMsgs = [
    'Inicia sesión para chatear con un asesor 🤝',
    'Recibe recomendaciones personalizadas ✨',
    'Accede a tu historial de conversación 📜'
  ];
  const [promoIdx, setPromoIdx] = useState(0);

  useEffect(() => {
    if (open) return;               // no mostrar tooltip si está abierto
    if (isAuthenticated) return;    // solo si NO hay sesión
    const id = setInterval(() => {
      setPromoIdx((i) => (i + 1) % promoMsgs.length);
    }, 4000);
    return () => clearInterval(id);
  }, [open, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Autoscroll ----
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // ---- Al abrir el chat: si hay sesión, asegura chat; si no, no intentes crearlo ----
  useEffect(() => {
    if (!open) return;

    // refresca estado de auth por si cambió
    const { user } = getStoredAuth();
    const authed = Boolean(user?.email);
    setIsAuthenticated(authed);

    if (!authed) {
      // Mensaje de bienvenida/CTA para no autenticados
      setMessages([
        { role: 'bot', text: 'Para conversar con un asesor, por favor inicia sesión.' },
        { role: 'bot', text: 'Así podremos personalizar tus recomendaciones y guardar tu historial.' }
      ]);
      return;
    }

    // Si está autenticado, asegura chat_id
    if (chatId) return;
    setInitializing(true);
    (async () => {
      try {
        const chat = await createOrLoadChat(); // usará cache o creará con email del usuario
        setChatId(chat.id);
      } catch (err) {
        console.error('No se pudo crear/cargar el chat:', err);
        setMessages((prev) => [
          ...prev,
          { role: 'system', text: '⚠️ No se pudo iniciar la sesión de chat. Intenta nuevamente.' },
        ]);
      } finally {
        setInitializing(false);
      }
    })();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);

    try {
      setLoading(true);

      // Si no está autenticado, no intentes enviar
      if (!isAuthenticated) {
        setMessages((prev) => [
          ...prev,
          { role: 'system', text: '🔐 Debes iniciar sesión para chatear con un asesor.' },
        ]);
        return;
      }

      // Garantizar chat_id ANTES de enviar
      const id = chatId ?? (await ensureChatId());
      if (!chatId) setChatId(id);

      const auth = getStoredAuth();

      const res = await sendToAgent({
        message: text,
        bot_type: 'web_chat_bot',
        chat_id: id,
        user_id: auth.user?.id ?? null,
        save_to_chat: true,
        context: { canal: 'web' },
      });

      const reply = res?.reply || 'No he podido generar una respuesta.';
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);

      // Render productos sugeridos (si hay)
      const productParts = (res?.messages || []).filter((p) => p.type === 'product');
      if (productParts.length) {
        const list = productParts
          .slice(0, 5)
          .map((p) =>
            p.type === 'product'
              ? `• ${p.content.nombre} — $${p.content.precio.toFixed(2)} (${p.content.categoria})`
              : ''
          )
          .join('\n');

        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: '🛒 Recomendaciones:\n' + list },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'system', text: '⚠️ Error enviando el mensaje. Revisa tu conexión o el backend.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  const disabled = loading || initializing || !isAuthenticated;

  return (
    <>
      {/* Tooltip de invitación cuando NO hay sesión y el chat está cerrado */}
      {!open && !isAuthenticated && (
        <div className="fixed bottom-24 right-6 max-w-[260px] rounded-xl shadow-lg bg-white border border-neutral-200 px-3 py-2 text-sm">
          {promoMsgs[promoIdx]}
        </div>
      )}

      {open && (
        <div className="fixed bottom-24 right-6 w-[360px] max-w-[92vw] h-[460px] rounded-2xl shadow-2xl bg-white border border-neutral-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-black text-white flex items-center justify-between">
            <div className="font-semibold">Asistente</div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-neutral-50">
            {initializing && isAuthenticated && (
              <div className="mx-auto text-xs text-neutral-500">iniciando conversación…</div>
            )}

            {!isAuthenticated && (
              <div className="mr-auto max-w-[90%] rounded-2xl px-3 py-2 bg-white border border-neutral-200">
                <div className="font-semibold mb-1">¡Hola!</div>
                <div className="text-sm text-neutral-700">
                  Para conversar con un asesor y recibir recomendaciones personalizadas, por favor inicia sesión.
                </div>
                <button
                  className="mt-3 px-3 py-2 rounded-lg bg-black text-white"
                  onClick={() => navigate('/login')}
                >
                  Iniciar sesión
                </button>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === 'user'
                    ? 'ml-auto max-w-[85%] rounded-2xl px-3 py-2 bg-black text-white'
                    : m.role === 'bot'
                    ? 'mr-auto max-w-[85%] rounded-2xl px-3 py-2 bg-white border border-neutral-200'
                    : 'mx-auto text-xs text-neutral-500'
                }
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input
              className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
              placeholder={
                !isAuthenticated
                  ? 'Inicia sesión para chatear'
                  : initializing
                  ? 'Preparando chat…'
                  : loading
                  ? 'Enviando...'
                  : 'Escribe tu mensaje...'
              }
              disabled={disabled}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={isAuthenticated ? handleSend : () => navigate('/login')}
              disabled={loading || initializing}
              className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
              aria-label={isAuthenticated ? 'Enviar' : 'Iniciar sesión'}
              title={isAuthenticated ? 'Enviar' : 'Iniciar sesión'}
            >
              {isAuthenticated ? (loading || initializing ? '...' : 'Enviar') : 'Login'}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-black text-white grid place-items-center text-xl"
        aria-label="Abrir chat"
        title="Chat"
      >
        💬
      </button>
    </>
  );
}
