import { KEYS, load, save } from "../storage";

export function loadExercises() {
  const stored = load(KEYS.exercises, null);
  return Array.isArray(stored) ? stored : [];
}

export function saveExecises(exercises) {
  return save(KEYS.exercises, exercises);
}
