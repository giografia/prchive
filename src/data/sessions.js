import { KEYS, load, save, loadString, saveString } from "../storage.js";

const KG_PER_LB = 0.45359237;

// Shape of one session:
// {
//   id,
//   date: "2026-11-18",          // YYYY-MM-DD
//   day: "wed",                  // which split day it was
//   entries: [
//     { exerciseId, name, sets: [{ reps: 8, weightKg: 60 }, ...] },
//   ],
// }

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
