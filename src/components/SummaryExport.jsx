import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

function formatTime(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

export default function SummaryExport({ entries, chartRef }) {
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

  async function handleExport() {
    setExporting(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(29, 78, 216);
      pdf.text("CareCompass", 40, 50);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Blood Pressure Summary  ·  Generated ${new Date().toLocaleDateString()}`, 40, 66);

      pdf.setDrawColor(229, 231, 235);
      pdf.line(40, 78, 572, 78);

      let cursorY = 95;

      // Chart capture (whichever range - 7 or 30 day - is currently selected on screen)
      if (chartRef?.current) {
        const canvas = await html2canvas(chartRef.current, {
          scale: 2,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 532; // page width minus margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 40, cursorY, imgWidth, imgHeight);
        cursorY += imgHeight + 20;
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(29, 78, 216);
      pdf.text(`${avgSystolic ?? "—"}/${avgDiastolic ?? "—"}`, 40, cursorY);
      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128);
      pdf.setFont("helvetica", "normal");
      pdf.text("Average Reading", 40, cursorY + 12);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(55, 65, 81);
      pdf.text(`${sorted.length}`, 200, cursorY);
      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128);
      pdf.setFont("helvetica", "normal");
      pdf.text("Readings Logged", 200, cursorY + 12);

      autoTable(pdf, {
        startY: cursorY + 30,
        head: [["Date", "Time", "Reading", "Meds", "Notes"]],
        body: sorted.map((e) => [
          e.date,
          formatTime(e.time),
          `${e.systolic}/${e.diastolic}`,
          e.medicationTaken ? "Yes" : "No",
          e.notes || "—",
        ]),
        styles: { fontSize: 9, cellPadding: 7, overflow: "linebreak", textColor: [55, 65, 81] },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 250, 252] },
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

      {/* Decorative preview only — NOT used to generate the PDF */}
      <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-xl font-bold text-blue-700">
              {avgSystolic}/{avgDiastolic}
            </p>
            <p className="text-xs text-gray-500">Avg Reading</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-700">{sorted.length}</p>
            <p className="text-xs text-gray-500">Readings Logged</p>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {sorted.map((e) => (
            <div key={e.id} className="text-xs border-t pt-2">
              <div className="flex justify-between text-gray-700 font-medium">
                <span>
                  {e.date} · {formatTime(e.time)}
                </span>
                <span>
                  {e.systolic}/{e.diastolic}
                </span>
              </div>
              <div className="flex justify-between text-gray-500 mt-0.5">
                <span>{e.medicationTaken ? "Medication taken" : "Medication not taken"}</span>
              </div>
              {e.notes && (
                <p className="text-gray-500 mt-0.5 italic">&ldquo;{e.notes}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      </div>

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