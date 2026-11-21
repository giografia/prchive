import { useEffect } from "react";
import { Link } from "react-router";
import { formatRenewal } from "../data/subscription";
import "./RenewalPopup.css";

function getCopy({ daysLeft, level }, date) {
  if (level === "urgent") {
    return {
      title: daysLeft === 0 ? "Expires today" : "Expires tomorrow",
      body: "Renew your gym subscription now so you don't lose access.",
    };
  }
  if (level === "soon") {
    return {
      title: `Expires in ${daysLeft} days`,
      body: `Your gym subscription expires on ${date}. Don't forget to renew it.`,
    };
  }
  return {
    title: "Expiring soon",
    body: `Your gym subscription expires in ${daysLeft} days, on ${date}.`,
  };
}

export default function RenewalPopup({ reminder, date, onClose }) {
  const copy = getCopy(reminder, formatRenewal(date));

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="renewal-popup__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`renewal-popup renewal popup--${reminder.level}`}
        role="dialog"
        aria-model="true"
        aria-labelledby="renewal-popup-title"
      >
        <p className="renewal-popup__eyebrow">Subscription reminder</p>
        <h2 id="renewal-popup-title" className="renewal-popup__title">
          {copy.title}
        </h2>
        <p className="renewal-popup__body">{copy.body}</p>
        <div className="renewal-popup__actions">
          <button
            type="button"
            className="renewal-popup__primary"
            onClick={onClose}
            autoFocus
          >
            Got it
          </button>
          <Link
            to="/subscription"
            className="renewal-popup__secondary"
            onClick={onClose}
          >
            Open subscription
          </Link>
        </div>
      </div>
    </div>
  );
}
