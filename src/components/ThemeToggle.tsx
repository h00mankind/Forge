import { memo, useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default memo(function ThemeToggle() {
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
      className="grid h-8 w-8 place-items-center text-text-tertiary
                 transition-[transform,background-color,color] duration-150 ease-out
                 hover:bg-surface-2 hover:text-text-secondary active:scale-95"
    >
      {dark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
});
