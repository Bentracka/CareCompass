import { deleteEntry } from "../lib/storage";

export default function EntryList({ entries, onDelete }) {
  if (entries.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No entries yet. Log your first reading above.
      </p>
    );
  }

  function handleDelete(id) {
    deleteEntry(id);
    onDelete(id);
  }

  return (
    <div className="bg-white rounded-2xl shadow divide-y">
      {entries.map((entry) => (
        <div key={entry.id} className="p-4 flex justify-between items-center">
          <div>
            <p className="font-medium">
              {entry.systolic}/{entry.diastolic}{" "}
              <span className="text-sm text-gray-500">mmHg</span>
            </p>
            <p className="text-sm text-gray-500">
              {entry.date} at {entry.time}
              {entry.medicationTaken ? " · Medication taken" : ""}
            </p>
            {entry.notes && (
              <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
            )}
          </div>
          <button
            onClick={() => handleDelete(entry.id)}
            className="text-red-500 text-sm hover:underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}