import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ToastProvider } from "./components/Toast.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./index.css";

document.documentElement.classList.add("theme", "dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </TooltipProvider>
  </StrictMode>
);
