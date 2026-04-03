import { createContext, useCallback, useContext, useState, memo } from "react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

interface ToastItem {
  id: number;
  message: string;
  type: "error" | "success";
}

interface ToastContextValue {
  showToast: (message: string, type?: "error" | "success") => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

const ToastMessage = memo(function ToastMessage({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      className={`flex items-start gap-2.5 border px-4 py-3 shadow-lg backdrop-blur-sm
                  animate-[toast-in_200ms_var(--ease-out)_forwards]
                  ${toast.type === "error"
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"}`}
    >
      {toast.type === "error"
        ? <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
        : <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" />}
      <span className="text-[12px] leading-relaxed flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 mt-0.5 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X size={11} />
      </button>
    </div>
  );
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: "error" | "success" = "error") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
