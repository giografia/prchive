import { KEYS, load, save } from "../storage";

export const DEFAULT_REST = 90;
export const REST_MIN = 15;
export const REST_MAX = 600;
export const REST_STEP = 15;

//timer older than this is forgotten
const STALE_MS = 10 * 60 * 1000;

function clampSeconds(n) {
  return Math.min(REST_MAX, Math.max(1, Math.round(n)));
}

export function loadRestTimer() {
  const value = load(KEYS.restTimer, null);
  const endsAt =
    Number.isFinite(value?.endsAt) && Date.now() - value.endsAt < STALE_MS
      ? value.endsAt
      : null;

  return {
    seconds: Number.isFinite(value?.seconds)
      ? clampSeconds(value.seconds)
      : DEFAULT_REST,
    endsAt,
    startedAt:
      endsAt !== null && Number.isFinite(value?.startedAt)
        ? value.startedAt
        : null,
  };
}

export function saveRestTimer(state) {
  return save(KEYS.restTimer, state);
}
export function clampRest(seconds) {
  return Math.min(REST_MAX, Math.max(REST_MIN, seconds));
}
export function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
