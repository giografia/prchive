function isBetter(a, b) {
  return a.kg > b.kg || (a.kg === b.kg && a.reps > b.reps);
}

export function topSet(sets) {
  let best = null;
  for (const s of sets) {
    if (best === null || isBetter(s, best)) best = s;
  }
  return best;
}

export function getHistory(sessions, exerciseId) {
  const points = [];
  for (const s of sessions) {
    const entry = s.entries.find((e) => e.exerciseId === exerciseId);
    const best = entry ? topSet(entry.sets) : null;
    if (best) points.push({ date: s.date, kg: best.kg, reps: best.reps });
  }
  return points.sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  );
}

export function getStats(history) {
  if (history.length === 0) return null;
  const first = history[0];
  const current = history[history.length - 1];
  let pr = first;
  for (const h of history) {
    if (isBetter(h, pr)) pr = h;
  }
  return {
    current,
    first,
    pr,
    changeKg: current.kg - first.kg,
    sessionCount: history.length,
  };
}

export function getLastLoggedExerciseId(sessions) {
  let latest = null;
  for (const s of sessions) {
    if (s.entries.length > 0 && (!latest || s.date >= latest.date)) latest = s;
  }
  return latest ? latest.entries[latest.entries.length - 1].exerciseId : null;
}
