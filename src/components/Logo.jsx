import "./Logo.css";

export default function Logo() {
  return (
    <span className="logo">
      <svg
        aria-hidden="true"
        width="40"
        height="40"
        viewBox="280 60 120 120"
        fill="none"
        stroke="var(--accent-text)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g transform="rotate(-35 340 120)">
          <path d="M318 120 H362" />
          <rect x="300" y="96" width="18" height="48" rx="5" />
          <rect x="362" y="96" width="18" height="48" rx="5" />
          <rect x="288" y="106" width="12" height="28" rx="4" />
          <rect x="380" y="106" width="12" height="28" rx="4" />
        </g>
      </svg>
      <span className="logo-text">PRchive</span>
    </span>
  );
}
