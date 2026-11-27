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

function mergeSides(left, right) {
  const bySession = new Map();
  for (const h of left) bySession.set(h.sessionId, { date: h.date, left: h });
  for (const h of right) {
    bySession.set(h.sessionId, {
      ...bySession.get(h.sessionId),
      date: h.date,
      right: h,
    });
  }
  return [...bySession.values()].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  );
}

const normalize = (name) =>
  (name ?? "").trim().toLowerCase().replace(/\s+/g, " ");

export default function Progress() {
  const { exerciseId } = useParams();
  const { exercises, sessions, unit, split } = useAppData();

  //ids of every exercise that is in at least one day of the split
  const inSplit = new Set(
    Object.values(split).flatMap((day) => day.exerciseIds),
  );

  //one group per name (ignoring case and extra spaces)
  const groups = [];
  const byKey = new Map();
  for (const ex of exercises) {
    const key = normalize(ex.name);
    if (!key) continue;
    let group = byKey.get(key);
    if (!group) {
      group = {
        name: ex.name,
        ids: [],
        linkId: null,
        unilateral: false,
        active: false,
      };
      byKey.set(key, group);
      groups.push(group);
    }
    group.ids.push(ex.id);
    if (inSplit.has(ex.id)) {
      if (!group.active) group.name = ex.name;
      group.active = true;
      group.linkId ??= ex.id;
      group.unilateral = group.unilateral || !!ex.unilateral;
    }
  }

  //only exercises in the split that have logged sets
  const visible = groups.filter(
    (g) => g.active && getHistory(sessions, g.ids).length > 0,
  );

  if (exerciseId && !visible.some((g) => g.ids.includes(exerciseId))) {
    return <Navigate to="/progress" replace />;
  }
  const preferredId = exerciseId ?? getLastLoggedExerciseId(sessions);
  const selected =
    visible.find((g) => g.ids.includes(preferredId)) ?? visible[0];

  const history = selected ? getHistory(sessions, selected.ids) : [];
  const stats = getStats(history);

  const sidedPoints = selected?.unilateral
    ? mergeSides(
        getHistory(sessions, selected.ids, "left"),
        getHistory(sessions, selected.ids, "right"),
      )
    : [];
  const sided = sidedPoints.length > 0;

  const data = sided
    ? sidedPoints.map((p) => ({
        label: shortDate(p.date),
        fullDate: longDate(p.date),
        left: p.left ? kgToDisplay(p.left.kg, unit) : null,
        leftReps: p.left?.reps,
        right: p.right ? kgToDisplay(p.right.kg, unit) : null,
        rightReps: p.right?.reps,
      }))
    : history.map((h) => ({
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
            {visible.map((g) => (
              <Link
                key={g.linkId}
                to={`/progress/${g.linkId}`}
                className={"progress__chip" + (g === selected ? " active" : "")}
                aria-current={g === selected ? "page" : undefined}
              >
                {g.name}
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

          <StrengthChart data={data} unit={unit} sided={sided} />

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
