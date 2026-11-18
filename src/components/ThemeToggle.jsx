import { useState } from "react";
import { KEYS, saveString } from "../storage.js";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark",
  );

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    saveString(KEYS.theme, next);
    setTheme(next);
  }
  return (
    <button type="button" className="theme-toggle" onClick={toggle}>
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
