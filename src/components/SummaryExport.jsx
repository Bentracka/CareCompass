import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatTime(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

export default function SummaryExport({ entries }) {
  const [exporting, setExporting] = useState(false);

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time)
  );

  const avgSystolic = sorted.length
    ? Math.round(sorted.reduce((sum, e) => sum + e.systolic, 0) / sorted.length)
    : null;
  const avgDiastolic = sorted.length
    ? Math.round(sorted.reduce((sum, e) => sum + e.diastolic, 0) / sorted.length)
    : null;

  function handleExport() {
    setExporting(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });

      pdf.setFontSize(18);
      pdf.setTextColor(29, 78, 216);
      pdf.text("CareCompass Summary", 40, 50);

      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Generated ${new Date().toLocaleDateString()}`, 40, 66);

      pdf.setFontSize(11);
      pdf.setTextColor(31, 41, 55);
      pdf.text(`Average: ${avgSystolic ?? "—"}/${avgDiastolic ?? "—"}`, 40, 92);
      pdf.text(`Total Readings: ${sorted.length}`, 220, 92);

      autoTable(pdf, {
        startY: 112,
        head: [["Date", "Time", "Reading", "Meds", "Notes"]],
        body: sorted.map((e) => [
          e.date,
          formatTime(e.time),
          `${e.systolic}/${e.diastolic}`,
          e.medicationTaken ? "Yes" : "No",
          e.notes || "—",
        ]),
        styles: { fontSize: 9, cellPadding: 6, overflow: "linebreak" },
        headStyles: { fillColor: [37, 99, 235] },
        columnStyles: { 4: { cellWidth: 180 } },
        margin: { left: 40, right: 40, top: 40, bottom: 40 },
      });

      pdf.save(`CareCompass-Summary-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  if (entries.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold">Doctor Visit Summary</h2>
      <p className="text-sm text-gray-500">
        Export a clean PDF of all your logged readings, formatted to bring to your next appointment.
      </p>
      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {exporting ? "Generating PDF..." : "Export Summary as PDF"}
      </button>
    </div>
  );
}