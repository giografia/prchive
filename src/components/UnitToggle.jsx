import { useAppData } from "../context/useAppData";
import "./UnitToggle.css";

export default function UnitToggle() {
  const { unit, setUnit } = useAppData();
  return (
    <div className="unit-toggle" role="group" aria-label="Weight unit">
      {["kg", "lb"].map((u) => (
        <button
          key={u}
          type="button"
          className={"unit-toggle__btn" + (unit === u ? " active" : "")}
          aria-pressed={unit === u}
          onClick={() => setUnit(u)}
        >
          {u}
        </button>
      ))}
    </div>
  );
}
