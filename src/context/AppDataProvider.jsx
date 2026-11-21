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
import { loadSubscription, saveSubscription } from "../data/subscription.js";

function init() {
  return {
    exercises: loadExercises(),
    split: loadSplit(),
    sessions: loadSessions(),
    unit: loadUnit(),
    subscription: loadSubscription(),
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

    case "subscription/dateSet":
      return {
        ...state,
        subscription: { ...state.subscription, renewalDate: action.date },
      };

    case "subscription/reminderToggled": {
      const current = state.subscription.remindDaysBefore;
      const next = current.includes(action.days)
        ? current.filter((d) => d !== action.days)
        : [...current, action.days];
      return {
        ...state,
        subscription: {
          ...state.subscription,
          remindDaysBefore: next.sort((a, b) => b - a),
        },
      };
    }

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
  useEffect(() => {
    saveSubscription(state.subscription);
  }, [state.subscription]);

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
    subscription: state.subscription,
    setRenewalDate: (date) => dispatch({ type: "subscription/dateSet", date }),
    toggleReminder: (days) =>
      dispatch({ type: "subscription/reminderToggled", days }),
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}
