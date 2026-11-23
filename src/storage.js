export const KEYS = {
  theme: "prchive-theme",
  split: "prchive-split",
  sessions: "prchive-sessions",
  unit: "prchive-unit",
  exercises: "prchive-exercises",
  subscription: "prchive-subscription",
  restTimer: "prchive-rest-timer",
};

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    //ignore
  }
}

export function loadString(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw;
  } catch {
    return fallback;
  }
}

export function saveString(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
