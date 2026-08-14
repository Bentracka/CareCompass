import { useState, useEffect } from "react";
import LogEntryForm from "./components/LogEntryForm";
import EntryList from "./components/EntryList";
import { getRecentEntries } from "./lib/storage";
import TrendChart from "./components/TrendChart";

export default function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(getRecentEntries());
  }, []);

  function handleEntryAdded() {
    setEntries(getRecentEntries());
  }

  function handleDelete() {
    setEntries(getRecentEntries());
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">CareCompass</h1>
          <p className="text-gray-500">Track your blood pressure, day by day</p>
        </header>

        <LogEntryForm onEntryAdded={handleEntryAdded} />
        <TrendChart entries={entries} />

        <div>
          <h2 className="text-lg font-semibold mb-2">Recent Readings</h2>
          <EntryList entries={entries} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}