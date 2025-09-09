import React, { useState, useRef, useEffect } from 'react';

type Message = { role: 'user' | 'bot'; text: string };

export default function FloatingChat(): React.ReactElement {{
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '¡Hola! ¿En qué puedo ayudarte hoy?' }
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {{
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }}, [messages, open]);

  const send = () => {{
    const msg = input.trim();
    if (!msg) return;
    setMessages(m => [...m, { role: 'user', text: msg }, { role: 'bot', text: 'Gracias por tu mensaje. Un asesor responderá pronto.' }]);
    setInput('');
  }};

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 w-80 max-w-[90vw] rounded-2xl border bg-white shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <span className="font-medium">Chat de ayuda</span>
            <button onClick={() => setOpen(false)} className="text-sm rounded-full border px-2 py-1 hover:bg-black hover:text-white">Cerrar</button>
          </div>
          <div className="h-64 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className="max-w-[85%]">
                  <span className={m.role === 'user' ? 'bg-black text-white rounded-2xl px-3 py-2 inline-block' : 'bg-gray-100 text-gray-900 rounded-2xl px-3 py-2 inline-block'}>
                    {m.text}
                  </span>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border rounded-xl px-3 py-2 text-sm"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => (e.key === 'Enter' ? send() : null)}
            />
            <button onClick={send} className="rounded-xl bg-black text-white px-4 py-2 text-sm">Enviar</button>
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
}}
