import { Link } from "react-router";
import { DAY_LABELS } from "../data/split";

export default function DayCard({ day, name, count, isToday, isOpen }) {
  const classes = ["day-card"];
  if (isToday) classes.push("day-card--today");
  if (isOpen) classes.push("day-card--open");

  return (
    <Link
      to={isOpen ? "/split" : `/split/${day}`}
      viewTransition
      className={classes.join(" ")}
      style={{ viewTransitionName: `day-${day}` }}
      aria-label={`${isOpen ? "Close" : "Open"} ${DAY_LABELS[day]}`}
    >
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
        <span className="day-card__arrow">→</span>
      </div>
    </Link>
  );
}
