import { useLayoutEffect, useRef, useState } from "react";
import LogForm from "../components/LogForm";
import UnitToggle from "../components/UnitToggle";
import { useAppData } from "../context/useAppData";
import { DAYS, DAY_LABELS, getTodayKey } from "../data/split";
import "./Log.css";

export default function Log() {
  const { sessions } = useAppData();
  const today = getTodayKey();
  const [day, setDay] = useState(today);
  const [justSaved, setJustSaved] = useState(false);
  const daysRef = useRef(null);
  const placedOnce = useRef(false);
  const [pill, setPill] = useState(null);

  useLayoutEffect(() => {
    function place() {
      const active = daysRef.current?.querySelector(".log__day.active");
      if (!active) return;
      setPill({
        x: active.offsetLeft,
        y: active.offsetTop,
        w: active.offsetWidth,
        h: active.offsetHeight,
        animate: placedOnce.current,
      });
      placedOnce.current = true;
    }
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [day]);

  return (
    <section className="log">
      <header className="log__header">
        <div>
          <p className="page-eyebrow">Log session</p>
          <h1 className="page-title">Log session</h1>
        </div>
        <UnitToggle />
      </header>

      <div
        className="log__days"
        role="group"
        aria-label="Choose day"
        ref={daysRef}
      >
        <span
          className={"log__pill" + (pill?.animate ? " animate" : "")}
          aria-hidden="true"
          style={
            pill
              ? {
                  width: pill.w,
                  height: pill.h,
                  transform: `translate(${pill.x}px, ${pill.y}px)`,
                }
              : { opacity: 0 }
          }
        />
        {DAYS.map((d) => (
          <button
            key={d}
            type="button"
            className={"log__day" + (d === day ? " active" : "")}
            aria-pressed={d === day}
            aria-label={DAY_LABELS[d]}
            onClick={() => {
              setDay(d);
              setJustSaved(false);
            }}
          >
            {d}
            {d === today && <span className="log__today" />}
          </button>
        ))}
      </div>

      {justSaved && <p className="log__saved">Session saved.</p>}

      <LogForm
        key={`${day}-${sessions.length}`}
        day={day}
        onFinished={() => setJustSaved(true)}
      />
    </section>
  );
}
