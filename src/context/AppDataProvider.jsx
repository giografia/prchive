import { useReducer, useEffect } from "react";
import { AppDataContext } from "./AppDataContext";
import { loadSplit, saveSplit } from "../data/split.js";
import {
  loadSessions,
  saveSessions,
  loadUnit,
  saveUnit,
} from "../data/sessions.js";
import { loadExercises, saveExecises } from "../data/exercises.js";

function init() {
  return {
    exercises: loadExercises(),
    split: loadSplit(),
    sessions: loadSessions(),
    unit: loadUnit(),
  };
}
function reducer(state, action) {
  switch (action.type) {
    case "exercise/added":
      return { ...state, exercises: [...state.exercises, action.exercise] };

    case "day/renamed":
      return {
        ...state,
        split: {
          ...state.split,
          [action.day]: { ...state.split[action.day], name: action.name },
        },
      };

    case "day/exerciseAdded": {
      const current = state.split[action.day];
      if (current.exerciseIds.includes(action.exerciseId)) return state;
      return {
        ...state,
        split: {
          ...state.split,
          [action.day]: {
            ...current,
            exerciseIds: [...current.exerciseIds, action.exerciseId],
          },
        },
      };
    }

    case "day/exerciseRemoved": {
      const current = state.split[action.day];
      return {
        ...state,
        split: {
          ...state.split,
          [action.day]: {
            ...current,
            exerciseIds: current.exerciseIds.filter(
              (id) => id !== action.exerciseId,
            ),
          },
        },
      };
    }

    case "session/added":
      return { ...state, sessions: [...state.sessions, action.session] };

    case "unit/set":
      return { ...state, unit: action.unit };

    default:
      return state;
  }
}

export default function AppDataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => {
    saveExecises(state.exercises);
  }, [state.exercises]);
  useEffect(() => {
    saveSplit(state.split);
  }, [state.split]);
  useEffect(() => {
    saveSessions(state.sessions);
  }, [state.sessions]);
  useEffect(() => {
    saveUnit(state.unit);
  }, [state.unit]);

  function addExercise(name) {
    const exercise = { id: crypto.randomUUID(), name: name.trim() };
    dispatch({ type: "exercise/added", exercise });
    return exercise;
  }
  function addSession(session) {
    dispatch({
      type: "session/added",
      session: { id: crypto.randomUUID(), ...session },
    });
  }

  const value = {
    exercises: state.exercises,
    split: state.split,
    sessions: state.sessions,
    unit: state.unit,
    setUnit: (unit) => dispatch({ type: "unit/set", unit }),
    addExercise,
    renameDay: (day, name) => dispatch({ type: "day/renamed", day, name }),
    addExerciseToDay: (day, exerciseId) =>
      dispatch({ type: "day/exerciseAdded", day, exerciseId }),
    removeExerciseFromDay: (day, exerciseId) =>
      dispatch({ type: "day/exerciseRemoved", day, exerciseId }),
    addSession,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
