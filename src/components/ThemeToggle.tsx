import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid h-8 w-8 place-items-center rounded-lg
                 bg-surface-2 text-text-secondary transition-[transform,background-color] duration-150 ease-out
                 hover:bg-surface-3 hover:text-text-primary
                 active:scale-95"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
