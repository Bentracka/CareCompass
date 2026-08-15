import LogEntryForm from "./components/LogEntryForm";
import EntryList from "./components/EntryList";
import TrendChart from "./components/TrendChart";
import AlertBanner from "./components/AlertBanner";
import ReminderSettings from "./components/ReminderSettings";
import { getRecentEntries } from "./lib/storage";
import { checkAlert } from "./lib/alerts";
import SummaryExport from "./components/SummaryExport";
import { useState, useEffect, useRef } from "react";
import { generateSampleEntries } from "./lib/sampleData";

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

  function handleLoadDemoData() {
    const sample = generateSampleEntries();
    localStorage.setItem("carecompass_entries", JSON.stringify(sample));
    setEntries(getRecentEntries());
  }

  function handleClearAllData() {
    if (confirm("This will delete all entries. Are you sure?")) {
      localStorage.removeItem("carecompass_entries");
    setEntries([]);
    }
  }

  const alert = checkAlert(entries);
  const chartRef = useRef(null);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">CareCompass</h1>
          <p className="text-gray-500">Track your blood pressure, day by day</p>
        </header>

        <AlertBanner alert={alert} />

        <LogEntryForm onEntryAdded={handleEntryAdded} />

        <TrendChart entries={entries} chartRef={chartRef} />

        <SummaryExport entries={entries} chartRef={chartRef} />

        <div>
          <h2 className="text-lg font-semibold mb-2">Recent Readings</h2>
          <EntryList entries={entries} onDelete={handleDelete} />
        </div>

        <ReminderSettings />
        <div className="text-center pt-2 pb-4 space-x-4">
      <button
     onClick={handleLoadDemoData}
      className="text-xs text-gray-400 hover:text-gray-600 underline"
      >
      Load demo data
   </button>
    <button
     onClick={handleClearAllData}
     className="text-xs text-gray-400 hover:text-gray-600 underline"
      >
      Clear all data
    </button>
    </div>
      </div>
    </div>
  );
}