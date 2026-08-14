// Default target range - can be made configurable in Settings later
export const DEFAULT_TARGET_RANGE = {
  systolicMax: 130,
  diastolicMax: 80,
};

export function checkAlert(entries, targetRange = DEFAULT_TARGET_RANGE, days = 3) {
  // Get the most recent entries, sorted oldest to newest
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
  );

  const recent = sorted.slice(-days);

  if (recent.length < days) {
    return null; // not enough data yet to evaluate a trend
  }

  const allHigh = recent.every(
    (e) => e.systolic > targetRange.systolicMax || e.diastolic > targetRange.diastolicMax
  );

  if (allHigh) {
    return {
      type: "high",
      message: `Your blood pressure has been above your target range for ${days} days in a row. Consider mentioning this at your next doctor's visit.`,
    };
  }

  return null;
}