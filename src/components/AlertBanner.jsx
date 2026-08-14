export default function AlertBanner({ alert }) {
  if (!alert) return null;

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex gap-3 items-start">
      <span className="text-amber-500 text-xl leading-none">⚠️</span>
      <p className="text-amber-800 text-sm">{alert.message}</p>
    </div>
  );
}