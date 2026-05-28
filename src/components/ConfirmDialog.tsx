"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "确定",
  cancelText = "取消",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-8">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={onCancel} />
      <div
        className="relative w-full max-w-xs bg-paper-highlight border-2 border-paper-line p-5 animate-sketch-in"
        style={{ borderRadius: "4px 6px 3px 5px" }}
      >
        <p className="text-body text-ink font-medium mb-2">{title}</p>
        <p className="text-caption text-ink-light mb-5">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-caption font-medium sketch-pill bg-paper-warm text-ink-light"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-caption font-medium sketch-pill ${
              danger
                ? "bg-expense text-paper-highlight border-expense"
                : "bg-ink text-paper-highlight border-ink"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
