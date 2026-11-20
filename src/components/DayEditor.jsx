import { useState } from "react";
import { useAppData } from "../context/useAppData";
import { DAY_LABELS } from "../data/split";
import "./DayEditor.css";

export default function DayEditor({ day }) {
  const {
    split,
    exercises,
    addExercise,
    renameDay,
    addExerciseToDay,
    removeExerciseFromDay,
  } = useAppData();
  const [draft, setDraft] = useState("");

  const { name, exerciseIds } = split[day];
  const nameById = Object.fromEntries(exercises.map((ex) => [ex.id, ex.name]));

  function handleAdd(e) {
    e.preventDefault();
    const typed = draft.trim();
    if (!typed) return;

    const existing = exerciseIds.find(
      (ex) => ex.name?.toLowerCase() === typed.toLowerCase(),
    );
    const exercise = existing ?? addExercise(typed);

    addExerciseToDay(day, exercise.id);
    setDraft("");
  }

  return (
    <div className="day-editor">
      <p className="day-editor__day">{DAY_LABELS[day]}</p>
      <input
        className="day-editor__name"
        value={name}
        onChange={(e) => renameDay(day, e.target.value)}
        onBlur={() => {
          if (!name.trim()) renameDay(day, "Rest");
        }}
        placeholder="Day name"
        aria-label={`${DAY_LABELS[day]} name`}
      />
      {exerciseIds.length === 0 ? (
        <p className="day-editor__empty">
          No exercises, this is a rest day. Make sure to eat enough protein!
        </p>
      ) : (
        <ul className="day-editor__list">
          {exerciseIds.map((id) => (
            <li key={id} className="day-editor__item">
              <span>{nameById[id] ?? "Unknown exercise"}</span>
              <button
                type="button"
                className="day-editor__remove"
                onClick={() => removeExerciseFromDay(day, id)}
                aria-label={`Remove ${nameById[id] ?? "exercise"}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      <form className="day-editor__add" onSubmit={handleAdd}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add exercise"
          aria-label={`Add exercise to ${DAY_LABELS[day]}`}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
