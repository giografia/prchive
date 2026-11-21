import { useState } from "react";
import { useAppData } from "../context/useAppData";
import {
  REMINDER_OPTIONS,
  daysUntil,
  displayToISO,
  formatRenewal,
  isoToDisplay,
  maskDate,
} from "../data/subscription";
import "./Subscription.css";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function Subscription() {
  const { subscription, setRenewalDate, toggleReminder } = useAppData();
  const { renewalDate, remindDaysBefore } = subscription;
  const daysLeft = daysUntil(renewalDate);
  const [text, setText] = useState(() => isoToDisplay(renewalDate));
  const invalid = text.length === 10 && displayToISO(text) === null;

  function handleDateChange(e) {
    const next = maskDate(e.target.value);
    setText(next);
    if (next === "") {
      setRenewalDate("");
      return;
    }
    const iso = displayToISO(next);
    if (iso) setRenewalDate(iso);
  }

  // leaving the field half-typed puts the last valid date back
  function handleDateBlur() {
    if (displayToISO(text) === null) setText(isoToDisplay(renewalDate));
  }

  let counter;
  if (daysLeft === null) {
    counter = { value: "-", label: "Set your renewal date" };
  } else if (daysLeft < 0) {
    counter = {
      value: "Passed",
      label: `${plural(-daysLeft, "day")} ago. Set the next renewal date.`,
    };
  } else if (daysLeft === 0) {
    counter = { value: "Today", label: "Your subscription renews today" };
  } else {
    counter = {
      value: String(daysLeft),
      label: `${daysLeft === 1 ? "day" : "days"} until renewal`,
    };
  }

  const earliest = remindDaysBefore.length
    ? Math.max(...remindDaysBefore)
    : null;
  let hint;
  if (earliest === null) {
    hint = "Reminders are off. Turn one on to get reminded of renewal.";
  } else if (!renewalDate) {
    hint = "Set a renewal date to start reminders.";
  } else {
    hint = `You'll see a popup every time you open PRchive, from ${plural(earliest, "day")} before renewal until the expiration.`;
  }

  return (
    <section className="subscription">
      <header>
        <p className="page-eyebrow">Subscription</p>
        <h1 className="page-title">Renewal</h1>
      </header>

      <div className="subscription__grid">
        <div className="subscription__card">
          <label className="subscription__label" htmlFor="renewal-date">
            Renewal date
          </label>
          <input
            id="renewal-date"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="DD/MM/YYYY"
            maxLength={10}
            className="subscription__date"
            value={text}
            onChange={handleDateChange}
            onBlur={handleDateBlur}
            aria-invalid={invalid}
          />
          {invalid && (
            <p className="subscription__error" role="alert">
              That date doesn't exist.
            </p>
          )}

          <p className="subscription__counter">{counter.value}</p>
          <p className="subscription__counter-label">{counter.label}</p>
          {renewalDate && (
            <p className="subscription__counter-date">
              {formatRenewal(renewalDate)}
            </p>
          )}
        </div>

        <div className="subscription__card">
          <p className="subscription__label">Remind me</p>
          <ul className="subscription__toggles">
            {REMINDER_OPTIONS.map((days) => {
              const on = remindDaysBefore.includes(days);
              return (
                <li key={days}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    className={"subscription__toggle" + (on ? " on" : "")}
                    onClick={() => toggleReminder(days)}
                  >
                    <span>{plural(days, "day")} before</span>
                    <span className="subscription__switch" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="subscription__hint">{hint}</p>
        </div>
      </div>
    </section>
  );
}
