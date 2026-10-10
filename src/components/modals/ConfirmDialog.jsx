import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Deletion",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  isDestructive = true,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface-1 p-6 shadow-2xl"
        >
          <div className="flex items-start gap-4">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                isDestructive ? "bg-alert/15 text-alert" : "bg-mint/15 text-mint"
              }`}
            >
              {isDestructive ? <AlertTriangle size={20} /> : <Trash2 size={20} />}
            </span>
            <div className="flex-1">
              <h3 className="font-heading text-base font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-mist">{message}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-mist hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line px-4 py-2 text-xs font-semibold text-mist hover:text-white"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`rounded-xl px-4 py-2 text-xs font-semibold shadow-lg transition-all ${
                isDestructive
                  ? "bg-alert text-white hover:opacity-90 shadow-alert/20"
                  : "bg-mint text-ink hover:opacity-90 shadow-mint/20"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
