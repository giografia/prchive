import { useLayoutEffect, useRef } from "react";

// Slides list items from their old position to their new one
// whenever the list changes (move, add, remove).
export default function useFlipList(listRef, duration = 700) {
  const previous = useRef(new Map());

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) {
      previous.current = new Map();
      return;
    }

    const next = new Map();
    for (const el of list.children) {
      const key = el.dataset.flipKey;
      const top = el.offsetTop;
      next.set(key, top);

      const before = previous.current.get(key);
      if (before !== undefined && before !== top) {
        el.animate(
          [
            { transform: `translateY(${before - top}px)` },
            { transform: "translateY(0)" },
          ],
          { duration, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
        );
      }
    }
    previous.current = next;
  });
}
