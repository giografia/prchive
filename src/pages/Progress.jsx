import { Link, Navigate, useParams } from "react-router";
import StatCard from "../components/StatCard";
import StrengthChart from "../components/StrengthChart";
import UnitToggle from "../components/UnitToggle";
import { useAppData } from "../context/useAppData";
import { kgToDisplay } from "../data/sessions";
import { getHistory, getLastLoggedExerciseId, getStats } from "../data/stats";
import "./Progress.css";

function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const shortDate = (iso) =>
  parseISO(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });

const longDate = (iso) =>
  parseISO(iso).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function Progress() {
  const { exerciseId } = useParams();
  const { exercises, sessions, unit } = useAppData();

  const logged = exercises.filter(
    (ex) => getHistory(sessions, ex.id).length > 0,
  );
  if (exerciseId && !logged.some((ex) => ex.id === exerciseId)) {
    return <Navigate to="/progress" replace />;
  }
  const selected =
    logged.find(
      (ex) => ex.id === (exerciseId ?? getLastLoggedExerciseId(sessions)),
    ) ?? logged[0];

  const history = selected ? getHistory(sessions, selected.id) : [];
  const stats = getStats(history);

  const data = history.map((h) => ({
    label: shortDate(h.date),
    fullDate: longDate(h.date),
    weight: kgToDisplay(h.kg, unit),
    reps: h.reps,
  }));
  const fmt = (set) => `${kgToDisplay(set.kg, unit)} ${unit} × ${set.reps}`;
  const change = stats ? kgToDisplay(stats.changeKg, unit) : 0;

  return (
    <section className="progress">
      <header className="progress__header">
        <div>
          <p className="page-eyebrow">Progress</p>
          <h1>{selected ? selected.name : "Progress"}</h1>
        </div>
        <UnitToggle />
      </header>

      {!selected ? (
        <p className="progress__empty">
          Nothing to chart yet. <Link to="/log">Log a session</Link> and your
          progress shows up here.
        </p>
      ) : (
        <>
          <div
            className="progress__picker"
            role="group"
            aria-label="Choose exercise"
          >
            {logged.map((ex) => (
              <Link
                key={ex.id}
                to={`/progress/${ex.id}`}
                className={
                  "progress__chip" + (ex.id === selected.id ? " active" : "")
                }
                aria-current={ex.id === selected.id ? "page" : undefined}
              >
                {ex.name}
              </Link>
            ))}
          </div>

          <div className="progress__stats">
            <StatCard
              label="Current"
              value={fmt(stats.current)}
              note={shortDate(stats.current.date)}
            />
            <StatCard
              label="Change"
              value={
                stats.sessionCount < 2
                  ? "-"
                  : `${change > 0 ? "+" : ""}${change} ${unit}`
              }
              note="since first session"
              tone={change > 0 ? "positive" : undefined}
            />
            <StatCard
              label="Personal record"
              value={fmt(stats.pr)}
              note={shortDate(stats.pr.date)}
            />
          </div>

          <StrengthChart data={data} unit={unit} />

          {stats.sessionCount < 2 && (
            <p className="progress__hint">
              Log one more session with this exercise to see a trend.
            </p>
          )}
        </>
      )}
    </section>
  );
}
