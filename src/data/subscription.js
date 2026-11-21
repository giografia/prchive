import { KEYS, load, save } from "../storage";

const MS_IN_DAY = 86400000;
export const REMINDER_OPTIONS = [7, 3, 1];

function normalize(value) {
  return {
    renewalDate:
      typeof value?.renewalDate === "string" ? value.renewalDate : "",
    remindDaysBefore: Array.isArray(value?.remindDaysBefore)
      ? value.remindDaysBefore.filter((d) => REMINDER_OPTIONS.includes(d))
      : REMINDER_OPTIONS,
  };
}

export function loadSubscription() {
  return normalize(load(KEYS.subscription, null));
}

export function saveSubscription(subscription) {
  return save(KEYS.subscription, subscription);
}

export function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysUntil(iso) {
  if (!iso) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((parseISO(iso) - today) / MS_IN_DAY);
}

export function formatRenewal(iso) {
  return parseISO(iso).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getReminder({ renewalDate, remindDaysBefore }) {
  const daysLeft = daysUntil(renewalDate);
  if (daysLeft === null || remindDaysBefore.length === 0) return null;
  if (daysLeft < 0 || daysLeft > Math.max(...remindDaysBefore)) return null;

  const level = daysLeft <= 1 ? "urgent" : daysLeft <= 3 ? "soon" : "early";
  return { daysLeft, level };
}

// "2026-11-21" -> "21/11/2026"
export function isoToDisplay(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// "21/11/2026" -> "2026-11-21"
export function displayToISO(text) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const [d, m, y] = match.slice(1).map(Number);
  const date = new Date(y, m - 1, d);
  const real =
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d;
  return real ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

// 21112026 -> 21/11/2026
export function maskDate(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)]
    .filter(Boolean)
    .join("/");
}
