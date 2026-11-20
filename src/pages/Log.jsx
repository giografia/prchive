import { useState } from "react";
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

  return (
    <section className="log">
      <header className="log__header">
        <div>
          <p className="page-eyebrow">Log session</p>
          <h1 className="page-title">Log session</h1>
        </div>
        <UnitToggle />
      </header>

      <div className="log__days" role="group" aria-label="Choose day">
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
