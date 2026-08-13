const KEY = "carecompass_entries";

export function getEntries() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function addEntry(entry) {
  const entries = getEntries();
  const newEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  entries.push(newEntry);
  localStorage.setItem(KEY, JSON.stringify(entries));
  return newEntry;
}

export function deleteEntry(id) {
  const entries = getEntries().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function getRecentEntries(limit = 30) {
  return getEntries()
    .sort((a, b) => new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time))
    .slice(0, limit);
}