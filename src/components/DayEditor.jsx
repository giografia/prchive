import { useState, useRef } from "react";
import { useAppData } from "../context/useAppData";
import { DAY_LABELS } from "../data/split";
import ExerciseRow from "./ExerciseRow";
import useFlipList from "../utils/useFlipList";
import "./DayEditor.css";

export default function DayEditor({ day }) {
  const {
    split,
    exercises,
    addExercise,
    renameDay,
    addExerciseToDay,
    removeExerciseFromDay,
    setExerciseUnilateral,
    moveExerciseInDay,
    renameExercise,
  } = useAppData();
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  useFlipList(listRef);

  const { name, exerciseIds } = split[day];
  const nameById = Object.fromEntries(exercises.map((ex) => [ex.id, ex.name]));
  const unilateralById = Object.fromEntries(
    exercises.map((ex) => [ex.id, !!ex.unilateral]),
  );

  function handleAdd(e) {
    e.preventDefault();
    const typed = draft.trim();
    if (!typed) return;

    const existing = exercises.find(
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
        <ul className="day-editor__list" ref={listRef}>
          {exerciseIds.map((id, index) => (
            <ExerciseRow
              key={id}
              id={id}
              name={nameById[id] ?? "Unknown exercise"}
              isFirst={index === 0}
              isLast={index === exerciseIds.length - 1}
              unilateral={unilateralById[id] ?? false}
              onMove={(direction) => moveExerciseInDay(day, id, direction)}
              onRename={(newName) => renameExercise(id, newName)}
              onToggleUnilateral={(value) => setExerciseUnilateral(id, value)}
              onRemove={() => removeExerciseFromDay(day, id)}
            />
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
