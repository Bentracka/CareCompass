const SETTINGS_KEY = "carecompass_settings";

export function getSettings() {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : { reminderTime: null, reminderEnabled: false };
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  return await Notification.requestPermission();
}

export function scheduleReminder(time) {
  clearScheduledReminder();

  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const scheduled = new Date();
  scheduled.setHours(hours, minutes, 0, 0);

  if (scheduled.getTime() <= now.getTime()) {
    scheduled.setDate(scheduled.getDate() + 1);
  }

  const msUntil = scheduled.getTime() - now.getTime();

  console.log(
    `[CareCompass] Reminder scheduled for ${scheduled.toLocaleString()} (in ${Math.round(
      msUntil / 1000
    )}s)`
  );

  const timeoutId = setTimeout(() => {
    showReminderNotification();
    scheduleReminder(time); // reschedule for the same time tomorrow
  }, msUntil);

  window.__carecompassReminderTimeout = timeoutId;
}

export function clearScheduledReminder() {
  if (window.__carecompassReminderTimeout) {
    clearTimeout(window.__carecompassReminderTimeout);
    window.__carecompassReminderTimeout = null;
    console.log("[CareCompass] Cleared scheduled reminder");
  }
}

function showReminderNotification() {
  if (Notification.permission === "granted") {
    new Notification("CareCompass Reminder", {
      body: "Time to log your blood pressure reading for today.",
    });
  }
}