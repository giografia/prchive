import { Link } from "react-router";
import { DAY_LABELS } from "../data/split";

export default function DayCard({ day, name, count, isToday }) {
  return (
    <div className={`day-card${isToday ? " day-card--today" : ""}`}>
      <div className="day-card__top">
        <span className="day-card__day">{day}</span>
        {isToday && <span className="day-card__badge">Today</span>}
      </div>
      <h2 className="day-card__name">{name}</h2>
      <div className="day-card__bottom">
        <p className="day-card__count">
          {count === 0
            ? "Rest day"
            : `${count} ${count === 1 ? "exercise" : "exercises"}`}
        </p>
        <Link
          to={`/split/${day}`}
          className="day-card__arrow"
          aria-label={`Open ${DAY_LABELS[day]}`}
        >
          →
        </Link>
      </div>
    </div>
  );
}
