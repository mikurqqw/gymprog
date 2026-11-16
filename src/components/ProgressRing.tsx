export function ProgressRing({
  label,
  value,
  target,
}: {
  label: string;
  value: number;
  target: number;
}) {
  const percent = Math.min(100, Math.max(0, (value / target) * 100));
  return (
    <div
      className="food-ring"
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="41" fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${percent * 2.576} 258`}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="55" textAnchor="middle" fill="var(--text)" fontSize="19" fontWeight="600">
          {Math.round(percent)}%
        </text>
      </svg>
      <b>{label}</b>
      <small>
        {Math.round(value)} / {Math.round(target)}
      </small>
    </div>
  );
}
