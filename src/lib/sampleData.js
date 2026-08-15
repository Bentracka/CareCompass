// Generates realistic-looking sample entries for demos, spanning the last 21 days
export function generateSampleEntries() {
  const entries = [];
  const today = new Date();

  const notesPool = [
    "",
    "",
    "",
    "Felt a bit tired this morning",
    "Slept poorly last night",
    "Went for a walk after work",
    "Forgot to take reading until evening",
    "Stressful day at work",
  ];

  for (let i = 20; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    // Gentle randomness around a realistic baseline, trending slightly better over time
    const trendAdjust = Math.floor(i / 5);
    const systolic = 128 - trendAdjust + Math.floor(Math.random() * 10 - 5);
    const diastolic = 82 - Math.floor(trendAdjust / 2) + Math.floor(Math.random() * 6 - 3);

    entries.push({
      id: crypto.randomUUID(),
      date: `${yyyy}-${mm}-${dd}`,
      time: "08:1" + Math.floor(Math.random() * 9),
      type: "blood_pressure",
      systolic,
      diastolic,
      medicationTaken: Math.random() > 0.15,
      notes: notesPool[Math.floor(Math.random() * notesPool.length)],
      createdAt: date.toISOString(),
    });
  }

  return entries;
}