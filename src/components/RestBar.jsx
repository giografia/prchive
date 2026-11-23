import { useEffect, useRef, useState } from "react";
import { formatClock } from "../data/restTimer";
import "./RestBar.css";

export default function RestBar({ startedAt, endsAt, onShift, onSkip }) {
  const [now, setNow] = useState(() => Date.now());
  const baseTitle = useRef(document.title);

  const remainingMs = endsAt - now;
  const over = remainingMs <= 0;
  const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000));
  const overBySeconds = Math.max(0, Math.floor(-remainingMs / 1000));
  const progress = Math.min(
    1,
    Math.max(0, (now - startedAt) / Math.max(1, endsAt - startedAt)),
  );
  const clock = over
    ? `+${formatClock(overBySeconds)}`
    : formatClock(secondsLeft);

  //tick and catch up when tab comes back
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  //show the countdown in the browser tab title
  useEffect(() => {
    const base = baseTitle.current;
    document.title = over ? `Rest over · ${base}` : `${clock} · ${base}`;
    return () => {
      document.title = base;
    };
  }, [clock, over]);

  //keep the screen awake while resting, so the alert can reach the user
  useEffect(() => {
    if (over) return;
    let lock = null;
    let cancelled = false;
    async function request() {
      if (lock && !lock.released) return;
      try {
        const next = await navigator.wakeLock?.request("screen");
        if (cancelled) next?.release();
        else lock = next ?? null;
      } catch {
        //not supported or refused, the timer still works
      }
    }
    function onVisible() {
      if (document.visibilityState === "visible") request();
    }
    request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release();
    };
  }, [over]);

  return (
    <div
      className={"rest-bar" + (over ? " rest-bar--over" : "")}
      role="timer"
      aria-label={over ? "Rest is over" : "Rest timer"}
    >
      <div className="rest-bar__main">
        <span className="rest-bar__label">{over ? "Rest over" : "Rest"}</span>
        <span className="rest-bar__time">{clock}</span>
      </div>

      <div className="rest-bar__actions">
        {!over && (
          <>
            <button
              type="button"
              className="rest-bar__btn"
              onClick={() => onShift(-15)}
            >
              −15s
            </button>
            <button
              type="button"
              className="rest-bar__btn"
              onClick={() => onShift(15)}
            >
              +15s
            </button>
          </>
        )}
        <button
          type="button"
          className="rest-bar__btn rest-bar__btn--main"
          onClick={onSkip}
        >
          {over ? "Dismiss" : "Skip"}
        </button>
      </div>

      {!over && (
        <div className="rest-bar__track" aria-hidden="true">
          <div
            className="rest-bar__fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
