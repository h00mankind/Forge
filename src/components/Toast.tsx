import { createContext, useCallback, useContext, useState } from "react";
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

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: "error" | "success" = "error") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-2.5 border px-3.5 py-2.5 shadow-lg
                        animate-[toast-in_200ms_var(--ease-out)_forwards]
                        ${toast.type === "error"
                          ? "border-red-500/30 bg-red-500/10 text-red-400"
                          : "border-green-500/30 bg-green-500/10 text-green-400"}`}
          >
            {toast.type === "error"
              ? <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              : <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />}
            <span className="text-xs leading-relaxed flex-1">{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="flex-shrink-0 mt-0.5 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
