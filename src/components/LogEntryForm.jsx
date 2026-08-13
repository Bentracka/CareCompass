import { useState } from "react";
import { addEntry } from "../lib/storage";

export default function LogEntryForm({ onEntryAdded }) {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [medicationTaken, setMedicationTaken] = useState(false);
  const [notes, setNotes] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toTimeString().slice(0, 5);

  function handleSubmit(e) {
    e.preventDefault();
    if (!systolic || !diastolic) return;

    const entry = addEntry({
      date: today,
      time: now,
      type: "blood_pressure",
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      medicationTaken,
      notes,
    });

    onEntryAdded(entry);
    setSystolic("");
    setDiastolic("");
    setMedicationTaken(false);
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">Log Today's Reading</h2>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Systolic
          </label>
          <input
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            placeholder="120"
            className="w-full border rounded-lg px-3 py-2 text-lg"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Diastolic
          </label>
          <input
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            placeholder="80"
            className="w-full border rounded-lg px-3 py-2 text-lg"
            required
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={medicationTaken}
          onChange={(e) => setMedicationTaken(e.target.checked)}
          className="w-5 h-5"
        />
        <span>Took medication today</span>
      </label>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How are you feeling today?"
          className="w-full border rounded-lg px-3 py-2"
          rows={2}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition"
      >
        Save Reading
      </button>
    </form>
  );
}