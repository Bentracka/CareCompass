import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TrendChart({ entries, chartRef }) {
  const [range, setRange] = useState(7);

  const chartData = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - range);

    return entries
      .filter((e) => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time))
      .map((e) => ({
        label: `${e.date.slice(5)}`, // MM-DD
        systolic: e.systolic,
        diastolic: e.diastolic,
      }));
  }, [entries, range]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Trend</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setRange(7)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              range === 7
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            7 days
          </button>
          <button
            onClick={() => setRange(30)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              range === 30
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            30 days
          </button>
        </div>
      </div>

     {chartData.length === 0 ? (
  <p className="text-gray-500 text-center py-8">
    No readings in this range yet.
  </p>
) : (
  <div ref={chartRef}>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={["dataMin - 10", "dataMax + 10"]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="systolic" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="diastolic" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}
    </div>
  );
}