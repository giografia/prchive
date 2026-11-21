import "./StatCard.css";

export default function StatCard({ label, value, note, tone }) {
  return (
    <div className={"stat-card" + (tone ? ` stat-card--${tone}` : "")}>
      <p className="stat-card-__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {note && <p className="stat-card__note">{note}</p>}
    </div>
  );
}
