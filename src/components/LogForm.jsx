import { useState } from "react";
import { Link } from "react-router";
import { useAppData } from "../context/useAppData";
import {
  displayToKg,
  getPreviousSets,
  kgToDisplay,
  todayISO,
} from "../data/sessions";
import "./LogForm.css";

const DEFAULT_ROWS = 2;

const emptySet = () => ({ weight: "", reps: "", weightUnit: null });

function shownWeight(set, unit) {
  if (set.weight === "" || set.weightUnit === unit) return set.weight;
  const n = parseFloat(set.weight);
  if (Number.isNaN(n)) return "";
  return String(kgToDisplay(displayToKg(n, set.weightUnit), unit));
}

function buildEntries(exerciseIds, sets) {
  return exerciseIds
    .map((exerciseId) => ({
      exerciseId,
      sets: sets[exerciseId]
        .map((s) => ({
          w: parseFloat(s.weight),
          reps: parseInt(s.reps, 10),
          unit: s.weightUnit,
        }))
        .filter((s) => s.w > 0 && s.reps > 0)
        .map((s) => ({
          kg: Math.round(displayToKg(s.w, s.unit) * 100) / 100,
          reps: s.reps,
        })),
    }))
    .filter((entry) => entry.sets.length > 0);
}

export default function LogForm({ day, onFinished }) {
  const { split, exercises, sessions, unit, addSession } = useAppData();
  const exerciseIds = split[day].exerciseIds;
  const nameById = Object.fromEntries(exercises.map((ex) => [ex.id, ex.name]));

  const [sets, setSets] = useState(() =>
    Object.fromEntries(
      exerciseIds.map((id) => {
        const count = getPreviousSets(sessions, id).length || DEFAULT_ROWS;
        return [id, Array.from({ length: count }, emptySet)];
      }),
    ),
  );

  function updateSet(id, index, field, value) {
    setSets((prev) => ({
      ...prev,
      [id]: prev[id].map((s, i) =>
        i === index
          ? {
              ...s,
              [field]: value,
              ...(field === "weight" ? { weightUnit: unit } : {}),
            }
          : s,
      ),
    }));
  }
  function addSet(id) {
    setSets((prev) => ({ ...prev, [id]: [...prev[id], emptySet()] }));
  }
  function removeSet(id, index) {
    setSets((prev) => ({
      ...prev,
      [id]: prev[id].filter((_, i) => i !== index),
    }));
  }
  const entries = buildEntries(exerciseIds, sets);

  function finish() {
    if (entries.length === 0) return;
    addSession({ date: todayISO(), weekday: day, entries });
    onFinished();
  }
  if (exerciseIds.length === 0) {
    return (
      <p className="log-form__empty">
        Nothing planned for this day. <Link to="/split">Edit your split</Link>{" "}
        to add exercises.
      </p>
    );
  }
  return (
    <div className="log-form">
      {exerciseIds.map((id) => {
        const previous = getPreviousSets(sessions, id);
        return (
          <section key={id} className="log-form__exercise">
            <h2 className="log-form__name">
              {nameById[id] ?? "Unknown exercise"}
            </h2>

            <div className="log-form__row log-form__row--head">
              <span>Set</span>
              <span>Previous</span>
              <span>Weight ({unit})</span>
              <span>Reps</span>
              <span />
            </div>

            {sets[id].map((set, i) => (
              <div key={i} className="log-form__row">
                <span className="log-form__num">{i + 1}</span>
                <span className="log-form__prev">
                  {previous[i]
                    ? `${kgToDisplay(previous[i].kg, unit)} × ${previous[i].reps}`
                    : "—"}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={shownWeight(set, unit)}
                  onChange={(e) => {
                    const v = e.target.value.replace(",", ".");
                    if (/^\d*\.?\d*$/.test(v)) updateSet(id, i, "weight", v);
                  }}
                  aria-label={`Set ${i + 1} weight`}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={set.reps}
                  onChange={(e) => updateSet(id, i, "reps", e.target.value)}
                  aria-label={`Set ${i + 1} reps`}
                />
                {sets[id].length > 2 ? (
                  <button
                    type="button"
                    className="log-form__remove"
                    onClick={() => removeSet(id, i)}
                    aria-label={`Remove set ${i + 1}`}
                  >
                    ✕
                  </button>
                ) : (
                  <span />
                )}
              </div>
            ))}

            <button
              type="button"
              className="log-form__add"
              onClick={() => addSet(id)}
            >
              + Add set
            </button>
          </section>
        );
      })}

      <button
        type="button"
        className="log-form__finish"
        onClick={finish}
        disabled={entries.length === 0}
      >
        Finish session
      </button>
    </div>
  );
}
