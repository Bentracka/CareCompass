import { useState, useEffect } from "react";
import {
  getSettings,
  saveSettings,
  requestNotificationPermission,
  scheduleReminder,
  clearScheduledReminder,
} from "../lib/notifications";

export default function ReminderSettings() {
  const [reminderTime, setReminderTime] = useState("08:00");
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const settings = getSettings();
    if (settings.reminderTime) setReminderTime(settings.reminderTime);
    setEnabled(settings.reminderEnabled || false);
  }, []);

  async function handleToggle() {
    if (!enabled) {
      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        setStatus("Notifications permission was not granted.");
        return;
      }
      scheduleReminder(reminderTime);
      saveSettings({ reminderTime, reminderEnabled: true });
      setEnabled(true);
      setStatus("Daily reminder set.");
    } else {
      clearScheduledReminder();
      saveSettings({ reminderTime, reminderEnabled: false });
      setEnabled(false);
      setStatus("Reminder turned off.");
    }
  }

  function handleTimeChange(e) {
    const newTime = e.target.value;
    setReminderTime(newTime);
    if (enabled) {
      scheduleReminder(newTime);
      saveSettings({ reminderTime: newTime, reminderEnabled: true });
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-3">
      <h2 className="text-lg font-semibold">Daily Reminder</h2>

      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-600">Remind me at</label>
        <input
          type="time"
          value={reminderTime}
          onChange={handleTimeChange}
          className="border rounded-lg px-3 py-1"
        />
      </div>

      <button
        onClick={handleToggle}
        className={`w-full rounded-lg py-2 font-medium transition ${
          enabled
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {enabled ? "Turn Off Reminder" : "Turn On Reminder"}
      </button>

      {status && <p className="text-sm text-gray-500">{status}</p>}
    </div>
  );
}