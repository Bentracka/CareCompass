import { useState, useEffect } from "react";
import LogEntryForm from "./components/LogEntryForm";
import EntryList from "./components/EntryList";
import TrendChart from "./components/TrendChart";
import AlertBanner from "./components/AlertBanner";
import ReminderSettings from "./components/ReminderSettings";
import { getRecentEntries } from "./lib/storage";
import { checkAlert } from "./lib/alerts";
import SummaryExport from "./components/SummaryExport";

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

  const alert = checkAlert(entries);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">CareCompass</h1>
          <p className="text-gray-500">Track your blood pressure, day by day</p>
        </header>

        <AlertBanner alert={alert} />

        <LogEntryForm onEntryAdded={handleEntryAdded} />

        <TrendChart entries={entries} />

        <SummaryExport entries={entries} />

        <div>
          <h2 className="text-lg font-semibold mb-2">Recent Readings</h2>
          <EntryList entries={entries} onDelete={handleDelete} />
        </div>

        <ReminderSettings />
      </div>
    </div>
  );
}