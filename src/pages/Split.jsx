import { Outlet, useParams } from "react-router";
import DayCard from "../components/DayCard";
import { useAppData } from "../context/useAppData.js";
import { DAYS, getTodayKey } from "../data/split";

export default function Split() {
  const { split } = useAppData();
  const { day: openDay } = useParams();
  const today = getTodayKey();

  return (
    <section className={`split${openDay ? " split--open" : ""}`}>
      <header className="split__header">
        <div>
          <p className="page-eyebrow">Weekly split</p>
          <h1 className="page-title">This week</h1>
        </div>
        <button type="button" className="split__edit">
          Edit split
        </button>
      </header>

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
    </section>
  );
}
