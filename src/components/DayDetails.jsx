import { Link, Navigate, useParams } from "react-router";
import { useAppData } from "../context/useAppData.js";
import { DAYS, DAY_LABELS } from "../data/split";

export default function DayDetails() {
  const { day } = useParams();
  const { split, exercises } = useAppData();

  if (!DAYS.includes(day)) return <Navigate to="/split" replace />;

  const { name, exerciseIds } = split[day];
  const nameById = Object.fromEntries(exercises.map((ex) => [ex.id, ex.name]));

  return (
    <div className="day-details">
      <div className="day-details__head">
        <div>
          <p className="day-details__day">{DAY_LABELS[day]}</p>
          <h2 className="day-details__name">{name}</h2>
        </div>
        <Link
          to="/split"
          viewTransition
          className="day-details__close"
          aria-label="Close details"
        >
          ✕
        </Link>
      </div>

      {exerciseIds.length === 0 ? (
        <p className="day-details__empty">No exercises yet.</p>
      ) : (
        <ol className="day-details__list">
          {exerciseIds.map((id) => (
            <li key={id} className="day-details__item">
              {nameById[id] ?? "Unknown exercise"}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
