import { useState } from "react";
import { clampRest, loadRestTimer, saveRestTimer } from "../data/restTimer";

export function useRestTimer() {
  const [state, setState] = useState(loadRestTimer);

  // Saved right away (not in an effect) so a remounting LogForm reads the new value
  function commit(next) {
    setState(next);
    saveRestTimer(next);
  }

  return {
    seconds: state.seconds,
    endsAt: state.endsAt,
    startedAt: state.startedAt,

    start() {
      const now = Date.now();
      commit({
        ...state,
        startedAt: now,
        endsAt: now + state.seconds * 1000,
      });
    },
    skip() {
      commit({ ...state, endsAt: null, startedAt: null });
    },
    // change the countdown that is running right now
    shift(deltaSeconds) {
      if (state.endsAt === null) return;
      const earliest = Date.now() + 1000;
      commit({
        ...state,
        endsAt: Math.max(state.endsAt + deltaSeconds * 1000, earliest),
      });
    },
    // change the default rest time
    changeSeconds(deltaSeconds) {
      commit({ ...state, seconds: clampRest(state.seconds + deltaSeconds) });
    },
  };
}
