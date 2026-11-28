import { useLayoutEffect } from "react";

const GAP = 16;

function setSpan(el) {
  el.style.gridRowEnd = `span ${Math.ceil(el.offsetHeight) + GAP}`;
}

export function useGrid(ref, dep) {
  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const items = [...grid.children];
    items.forEach(setSpan);
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => setSpan(entry.target));
    });
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref, dep]);
}
