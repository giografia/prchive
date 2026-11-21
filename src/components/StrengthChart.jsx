import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./StrengthChart.css";

function ChartTooltip({ active, payload, unit }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="strength-chart__tip">
      <p className="strength-chart__tip-date">{point.fullDate}</p>
      <p>
        <strong>
          {point.weight} {unit}
        </strong>{" "}
        × {point.reps}
      </p>
    </div>
  );
}

export default function StrengthChart({ data, unit }) {
  return (
    <div className="strength-chart">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
        >
          <CartesianGrid stroke="var(--line)" vertical={false} />
          <XAxis dataKey="label" stroke="var(--muted)" tickline={false} />
          <YAxis
            stroke="var(--muted)"
            tickline={false}
            width={48}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<ChartTooltip unit={unit} />} shared={false} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--accent-text)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--accent-text)" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
