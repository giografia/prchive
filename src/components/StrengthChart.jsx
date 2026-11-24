import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./StrengthChart.css";

const SIDE_NAMES = { left: "Left", right: "Right" };

function ChartTooltip({ active, payload, unit }) {
  if (!active || !payload?.length) return null;
  const { dataKey, payload: point } = payload[0];
  const weight = point[dataKey];
  const reps = dataKey === "weight" ? point.reps : point[`${dataKey}Reps`];
  return (
    <div className="strength-chart__tip">
      <p className="strength-chart__tip-date">{point.fullDate}</p>
      <p>
        {SIDE_NAMES[dataKey] && <span>{SIDE_NAMES[dataKey]}: </span>}
        <strong>
          {weight} {unit}
        </strong>{" "}
        × {reps}
      </p>
    </div>
  );
}

export default function StrengthChart({ data, unit, sided = false }) {
  return (
    <div className="strength-chart">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 48, bottom: 0, left: 0 }}
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
          {sided ? (
            <>
              <Legend />
              <Line
                type="monotone"
                dataKey="left"
                name="Left"
                connectNulls
                stroke="var(--accent-text)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--accent-text)" }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="right"
                name="Right"
                connectNulls
                stroke="var(--accent-2)"
                strokeWidth={3}
                strokeDasharray="6 4"
                dot={{ r: 4, fill: "var(--text)" }}
                activeDot={{ r: 7 }}
              />
            </>
          ) : (
            <Line
              type="monotone"
              dataKey="weight"
              stroke="var(--accent-text)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--accent-text)" }}
              activeDot={{ r: 7 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
