# Integración del Asistente (Floating Chat)

- **API base**: definida por `VITE_API_URL` (por defecto `http://localhost:8000`).
- **Flujo**:
  1. Al abrir el chat, se crea (o reutiliza) un `chat_id` en `localStorage` (`/chats`).
  2. Cada mensaje usa `/ai-agent/process` con `bot_type = "web_chat_bot"` y `save_to_chat = true`.
  3. Si hay sesión iniciada, se adjunta `user_id` al mensaje.

## Variables de entorno
Añade en `.env` (o usa `.env.example`):
```
VITE_API_URL=http://localhost:8000
```

## Archivos nuevos
- `src/api/agent.ts`: funciones para crear/cargar chat y enviar mensajes al agente.

## Archivos modificados
- `src/components/FloatingChat.tsx`: ahora conecta el chat con el backend.
