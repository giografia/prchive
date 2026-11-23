import { REST_MAX, REST_MIN, REST_STEP, formatClock } from "../data/restTimer";
import "./RestSettings.css";

export default function RestSettings({ seconds, onChange }) {
  return (
    <div className="rest-settings">
      <span className="rest-settings__label">Rest</span>

      <div className="rest-settings__stepper">
        <button
          type="button"
          className="rest-settings__btn"
          onClick={() => onChange(-REST_STEP)}
          disabled={seconds <= REST_MIN}
          aria-label="Shorter rest"
        >
          −
        </button>
        <span className="rest-settings__value">{formatClock(seconds)}</span>
        <button
          type="button"
          className="rest-settings__btn"
          onClick={() => onChange(REST_STEP)}
          disabled={seconds >= REST_MAX}
          aria-label="Longer rest"
        >
          +
        </button>
      </div>
    </div>
  );
}
