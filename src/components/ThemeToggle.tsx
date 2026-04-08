import { memo, useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default memo(function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme");
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
      className="surface-lift micro-glow grid h-8 w-8 place-items-center text-text-tertiary
                 hover:bg-surface-2 hover:text-text-secondary"
    >
      {dark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
});
