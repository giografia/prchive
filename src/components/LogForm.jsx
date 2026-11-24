import { useState } from "react";
import { Link } from "react-router";
import { useAppData } from "../context/useAppData";
import { useRestTimer } from "../hooks/useRestTimer";
import RestBar from "./RestBar";
import RestSettings from "./RestSettings";
import {
  displayToKg,
  getPreviousSets,
  kgToDisplay,
  todayISO,
} from "../data/sessions";
import "./LogForm.css";

const DEFAULT_ROWS = 2;
const SIDES = ["left", "right"];

const emptySide = () => ({
  weight: "",
  reps: "",
  weightUnit: null,
  done: false,
});

const emptySet = (unilateral) =>
  unilateral ? { left: emptySide(), right: emptySide() } : emptySide();

const isFilled = (side) =>
  parseFloat(side.weight) > 0 && parseInt(side.reps, 10) > 0;

const isSided = (s) => Boolean(s && (s.left || s.right));

function shownWeight(set, unit) {
  if (set.weight === "" || set.weightUnit === unit) return set.weight;
  const n = parseFloat(set.weight);
  if (Number.isNaN(n)) return "";
  return String(kgToDisplay(displayToKg(n, set.weightUnit), unit));
}

// Text for the "Previous" column. Works for old flat sets and new sided sets.
function prevText(prev, side, unit) {
  if (!prev) return "—";
  let p;
  if (side) {
    // old flat set shown on the left row only
    p = isSided(prev) ? prev[side] : side === "left" ? prev : null;
  } else {
    p = isSided(prev) ? (prev.left ?? prev.right) : prev;
  }
  return p ? `${kgToDisplay(p.kg, unit)} × ${p.reps}` : "—";
}

function toSaved(side) {
  const w = parseFloat(side.weight);
  const reps = parseInt(side.reps, 10);
  if (!(w > 0 && reps > 0)) return null;
  return {
    kg: Math.round(displayToKg(w, side.weightUnit) * 100) / 100,
    reps,
  };
}

function buildEntries(exerciseIds, sets, unilateralById) {
  return exerciseIds
    .map((exerciseId) => ({
      exerciseId,
      sets: sets[exerciseId]
        .map((set) => {
          if (unilateralById[exerciseId]) {
            const left = toSaved(set.left);
            const right = toSaved(set.right);
            if (!left && !right) return null;
            return { ...(left && { left }), ...(right && { right }) };
          }
          return toSaved(set);
        })
        .filter(Boolean),
    }))
    .filter((entry) => entry.sets.length > 0);
}

export default function LogForm({ day, onFinished }) {
  const { split, exercises, sessions, unit, addSession } = useAppData();
  const exerciseIds = split[day].exerciseIds;
  const nameById = Object.fromEntries(exercises.map((ex) => [ex.id, ex.name]));
  const unilateralById = Object.fromEntries(
    exercises.map((ex) => [ex.id, !!ex.unilateral]),
  );
  const rest = useRestTimer();

  const [sets, setSets] = useState(() =>
    Object.fromEntries(
      exerciseIds.map((id) => {
        const count = getPreviousSets(sessions, id).length || DEFAULT_ROWS;
        return [
          id,
          Array.from({ length: count }, () => emptySet(unilateralById[id])),
        ];
      }),
    ),
  );

  function updateSet(id, index, field, value, side = null) {
    const unitPatch = field === "weight" ? { weightUnit: unit } : {};
    setSets((prev) => ({
      ...prev,
      [id]: prev[id].map((s, i) => {
        if (i !== index) return s;
        if (side) {
          return { ...s, [side]: { ...s[side], [field]: value, ...unitPatch } };
        }
        return { ...s, [field]: value, ...unitPatch };
      }),
    }));
  }
  function copyLeftToRight(id, index) {
    setSets((prev) => ({
      ...prev,
      [id]: prev[id].map((s, i) =>
        i === index ? { ...s, right: { ...s.left, done: false } } : s,
      ),
    }));
  }
  function addSet(id) {
    setSets((prev) => ({
      ...prev,
      [id]: [...prev[id], emptySet(unilateralById[id])],
    }));
  }
  function removeSet(id, index) {
    setSets((prev) => ({
      ...prev,
      [id]: prev[id].filter((_, i) => i !== index),
    }));
  }
  function toggleDone(id, index, side = null) {
    const set = sets[id][index];
    const target = side ? set[side] : set;
    const wasDone = target.done;
    updateSet(id, index, "done", !wasDone, side);
    if (!wasDone) rest.start();
  }
  const entries = buildEntries(exerciseIds, sets, unilateralById);

  function finish() {
    if (entries.length === 0) return;
    rest.skip();
    addSession({ date: todayISO(), weekday: day, entries });
    onFinished();
  }

  function renderInputs(id, i, set, side) {
    const target = side ? set[side] : set;
    const label = side ? `Set ${i + 1} ${side}` : `Set ${i + 1}`;
    return (
      <>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={shownWeight(target, unit)}
          onChange={(e) => {
            const v = e.target.value.replace(",", ".");
            if (/^\d*\.?\d*$/.test(v)) updateSet(id, i, "weight", v, side);
          }}
          aria-label={`${label} weight`}
        />
        <input
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          value={target.reps}
          onChange={(e) => updateSet(id, i, "reps", e.target.value, side)}
          aria-label={`${label} reps`}
        />
      </>
    );
  }

  function renderCheck(id, i, set, side = null) {
    const target = side ? set[side] : set;
    const label = side ? `Set ${i + 1} ${side}` : `Set ${i + 1}`;
    return (
      <button
        type="button"
        className={
          "log-form__check" + (target.done ? " log-form__check--done" : "")
        }
        onClick={() => toggleDone(id, i, side)}
        disabled={!target.done && !isFilled(target)}
        aria-pressed={target.done}
        aria-label={`${label} done, start rest timer`}
      >
        ✓
      </button>
    );
  }

  function renderRemove(id, i) {
    return sets[id].length > 2 ? (
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
    );
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
    <div
      className={
        "log-form" + (rest.endsAt !== null ? " log-form--resting" : "")
      }
    >
      <RestSettings seconds={rest.seconds} onChange={rest.changeSeconds} />

      {exerciseIds.map((id) => {
        const previous = getPreviousSets(sessions, id);
        const uni = unilateralById[id];
        return (
          <section key={id} className="log-form__exercise">
            <h2 className="log-form__name">
              {nameById[id] ?? "Unknown exercise"}
            </h2>

            <div
              className={
                "log-form__row log-form__row--head" +
                (uni ? " log-form__row--sided" : "")
              }
            >
              <span>Set</span>
              {uni && <span>Side</span>}
              <span>Previous</span>
              <span>Weight ({unit})</span>
              <span>Reps</span>
              <span />
              <span />
            </div>

            {sets[id].map((set, i) =>
              uni ? (
                <div key={i} className="log-form__set">
                  {SIDES.map((side) => (
                    <div
                      key={side}
                      className="log-form__row log-form__row--sided"
                    >
                      <span className="log-form__num">
                        {side === "left" ? i + 1 : ""}
                      </span>
                      <span className="log-form__side">
                        {side === "left" ? "L" : "R"}
                      </span>
                      <span className="log-form__prev">
                        {prevText(previous[i], side, unit)}
                      </span>
                      {renderInputs(id, i, set, side)}
                      {renderCheck(id, i, set, side)}
                      {side === "left" ? (
                        renderRemove(id, i)
                      ) : (
                        <button
                          type="button"
                          className="log-form__copy"
                          onClick={() => copyLeftToRight(id, i)}
                          aria-label={`Set ${i + 1} copy left to right`}
                        >
                          L→R
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div key={i} className="log-form__row">
                  <span className="log-form__num">{i + 1}</span>
                  <span className="log-form__prev">
                    {prevText(previous[i], null, unit)}
                  </span>
                  {renderInputs(id, i, set, null)}
                  {renderCheck(id, i, set)}
                  {renderRemove(id, i)}
                </div>
              ),
            )}

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

      {rest.endsAt !== null && (
        <RestBar
          key={rest.startedAt}
          startedAt={rest.startedAt}
          endsAt={rest.endsAt}
          mode={rest.mode}
          onShift={rest.shift}
          onSkip={rest.skip}
        />
      )}
    </div>
  );
}
