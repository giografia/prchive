import { useState } from "react";
import "./ExerciseRow.css";

export default function ExerciseRow({
  id,
  name,
  isFirst,
  isLast,
  unilateral,
  onMove,
  onRename,
  onToggleUnilateral,
  onRemove,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  function startEditing() {
    setDraft(name);
    setError("");
    setEditing(true);
  }
  function cancel() {
    setEditing(false);
    setError("");
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (draft.trim() === name) return cancel();
    const message = onRename(draft);
    if (message) setError(message);
    else cancel();
  }

  return (
    <li className="day-editor__item exercise-row" data-flip-key={id}>
      <div className="exercise-row__main">
        {editing ? (
          <form className="exercise-row__form" onSubmit={handleSubmit}>
            <input
              className="exercise-row__input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && cancel()}
              aria-label={`Rename ${name}`}
              autoFocus
            />
            <button
              type="submit"
              className="exercise-row__btn"
              aria-label="Save name"
            >
              ✓
            </button>
            <button
              type="button"
              className="exercise-row__btn"
              onClick={cancel}
              aria-label="Cancel rename"
            >
              ✕
            </button>
          </form>
        ) : (
          <>
            <span className="exercise-row__name">{name}</span>
            <button
              type="button"
              className="exercise-row__btn"
              onClick={startEditing}
              aria-label={`Rename ${name}`}
            >
              ✎
            </button>
          </>
        )}
      </div>

      {error && <p className="exercise-row__error">{error}</p>}

      <div className="exercise-row__controls">
        <button
          type="button"
          className="exercise-row__btn"
          onClick={() => onMove(-1)}
          disabled={isFirst}
          aria-label={`Move ${name} up`}
        >
          ↑
        </button>
        <button
          type="button"
          className="exercise-row__btn"
          onClick={() => onMove(1)}
          disabled={isLast}
          aria-label={`Move ${name} down`}
        >
          ↓
        </button>
        <label className="day-editor__uni">
          <input
            type="checkbox"
            checked={unilateral}
            onChange={(e) => onToggleUnilateral(e.target.checked)}
          />
          Unilateral
        </label>
        <button
          type="button"
          className="day-editor__remove"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        >
          ✕
        </button>
      </div>
    </li>
  );
}
