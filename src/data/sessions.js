import { KEYS, load, save, loadString, saveString } from "../storage.js";

const KG_PER_LB = 0.45359237;

// Shape of one session:
// {
//   id,
//   date: "2026-11-18",          // YYYY-MM-DD
//   weekday: "wed",
//   entries: [
//     { exerciseId: "bench", sets: [{ kg: 77.5, reps: 8 }, ...] },
//   ],
// }
// Weights are always stored in kg.

export function loadSessions() {
  return load(KEYS.sessions, []);
}

export function saveSessions(sessions) {
  return save(KEYS.sessions, sessions);
}

export function loadUnit() {
  const unit = loadString(KEYS.unit, "kg");
  return unit === "lb" ? "lb" : "kg";
}

export function saveUnit(unit) {
  return saveString(KEYS.unit, unit);
}

export function kgToDisplay(kg, unit) {
  const value = unit === "lb" ? kg / KG_PER_LB : kg;
  return Math.round(value * 10) / 10;
}

export function displayToKg(value, unit) {
  return unit === "lb" ? value * KG_PER_LB : value;
}
