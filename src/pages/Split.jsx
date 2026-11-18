import DayCard from "../components/DayCard";
import { useAppData } from "../context/useAppData.js";
import { DAYS, getTodayKey } from "../data/split";

export default function Split() {
  const { split } = useAppData();
  const today = getTodayKey();

  return (
    <section className="split">
      <header className="split__header">
        <div>
          <p className="page-eyebrow">Weekly split</p>
          <h1 className="page-title">This week</h1>
        </div>
        <button type="button" className="split__edit">
          Edit split
        </button>
      </header>

      <div className="split__grid">
        {DAYS.map((day) => (
          <DayCard
            key={day}
            day={day}
            name={split[day].name}
            count={split[day].exercises.length}
            isToday={day === today}
          />
        ))}
      </div>
    </section>
  );
}
