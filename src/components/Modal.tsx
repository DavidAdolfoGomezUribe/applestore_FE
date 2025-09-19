// src/components/Modal.tsx
import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidthClass = "max-w-3xl",
}: ModalProps): React.ReactElement | null {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className={`relative z-[101] w-full ${maxWidthClass} mx-4 rounded-2xl bg-white shadow-lg`} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100" aria-label="Cerrar">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
