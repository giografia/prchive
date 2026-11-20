import { useState } from "react";
import { Outlet, useParams } from "react-router";
import DayCard from "../components/DayCard";
import DayEditor from "../components/DayEditor";
import { useAppData } from "../context/useAppData.js";
import { DAYS, getTodayKey } from "../data/split";

export default function Split() {
  const { split } = useAppData();
  const { day: openDay } = useParams();
  const [editing, setEditing] = useState(false);
  const today = getTodayKey();

  return (
    <section className={`split${openDay && !editing ? " split--open" : ""}`}>
      <header className="split__header">
        <div>
          <p className="page-eyebrow">Weekly split</p>
          <h1 className="page-title">{editing ? "Edit split" : "This week"}</h1>
        </div>
        <button
          type="button"
          className="split__edit"
          onClick={() => setEditing((e) => !e)}
        >
          {editing ? "Done" : "Edit split"}
        </button>
      </header>

      {editing ? (
        <div className="split__editor">
          {DAYS.map((day) => (
            <DayEditor key={day} day={day} />
          ))}
        </div>
      ) : (
        <div className="split__layout">
          <div className="split__grid">
            {DAYS.map((day) => (
              <DayCard
                key={day}
                day={day}
                name={split[day].name}
                count={split[day].exerciseIds.length}
                isToday={day === today}
                isOpen={day === openDay}
              />
            ))}
          </div>
          <aside className="split__panel">
            <Outlet />
          </aside>
        </div>
      )}
    </section>
  );
}
