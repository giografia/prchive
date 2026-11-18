import { KEYS, load, save } from "../storage";

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const DAY_LABELS = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const JS_DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function getTodayKey() {
  return JS_DAYS[new Date().getDay()];
}

// Shape: { mon: { name: "Push", exercises: [{ id, name }] }, ... }
function normalizeDay(value) {
  if (Array.isArray(value)) return { name: "Rest", exercises: value }; // older saved format
  return { name: value?.name || "Rest", exercises: value?.exercises || [] };
}

export function loadSplit() {
  const stored = load(KEYS.split, null) ?? {};
  return Object.fromEntries(
    DAYS.map((day) => [day, normalizeDay(stored[day])]),
  );
}

export function saveSplit(split) {
  return save(KEYS.split, split);
}
