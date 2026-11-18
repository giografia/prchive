import { useState, useEffect } from "react";
import { AppDataContext } from "./AppDataContext";
import { loadSplit, saveSplit } from "../data/split.js";
import {
  loadSessions,
  saveSessions,
  loadUnit,
  saveUnit,
} from "../data/sessions.js";

export default function AppDataProvider({ children }) {
  const [split, setSplit] = useState(loadSplit);
  const [sessions, setSessions] = useState(loadSessions);
  const [unit, setUnit] = useState(loadUnit);

  useEffect(() => {
    saveSplit(split);
  }, [split]);
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);
  useEffect(() => {
    saveUnit(unit);
  }, [unit]);

  function addExercise(day, name) {
    const exercise = { id: crypto.randomUUID(), name: name.trim() };
    setSplit((prev) => ({
      ...prev,
      [day]: { ...prev[day], exercises: [...prev[day].exercises, exercise] },
    }));
  }

  function removeExercise(day, id) {
    setSplit((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercises: prev[day].exercises.filter((ex) => ex.id !== id),
      },
    }));
  }
  function addSession(session) {
    setSessions((prev) => [...prev, { id: crypto.randomUUID(), ...session }]);
  }
  const value = {
    split,
    sessions,
    unit,
    setUnit,
    addExercise,
    removeExercise,
    addSession,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
