import { createContext, useCallback, useContext, useState, memo } from "react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  index,
  total,
  onDismiss,
}: {
  toast: ToastItem;
  index: number;
  total: number;
  onDismiss: (id: number) => void;
}) {
  const stackDepth = total - index - 1;

  return (
    <div
      className={`flex items-start gap-2.5 border px-4 py-3 shadow-lg backdrop-blur-sm
                  animate-[toast-in_200ms_var(--ease-out)_forwards]
                  transition-[transform,opacity] duration-[220ms] ease-[var(--ease-smooth)]
                  ${toast.type === "error"
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"}`}
      style={{
        transform: `translateY(${stackDepth * -6}px) scale(${1 - stackDepth * 0.02})`,
        opacity: Math.max(0.7, 1 - stackDepth * 0.08),
      }}
    >
      {toast.type === "error"
        ? <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
        : <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" />}
      <span className="text-[12px] leading-relaxed flex-1">{toast.message}</span>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 mt-0.5 opacity-50 hover:opacity-100"
      >
        <X size={11} />
      </Button>
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
      <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm flex-col gap-2">
        {toasts.map((toast, index) => (
          <ToastMessage
            key={toast.id}
            toast={toast}
            index={index}
            total={toasts.length}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
