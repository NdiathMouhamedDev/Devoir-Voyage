import React, { useEffect, useState, useRef } from "react";

/**
 * Props
 * - start: string | Date (obligatoire)  => date/heure de départ (ISO ou Date)
 * - end: string | Date (optionnel)     => date/heure d'arrivée (ISO or Date)
 * - size: number (px)                  => diamètre du cercle (default 140)
 * - stroke: number                     => épaisseur du trait (default 10)
 */
export default function SmartCountdown({ start, end = null, size = 140, stroke = 10 }) {
  const [now, setNow] = useState(new Date());
  const [valid, setValid] = useState(true);
  const rafRef = useRef(null);

  // robust parse helper: accepte Date, ISO string or "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DD HH:mm:ss"
  function parseDate(d) {
    if (!d) return null;
    if (d instanceof Date) return d;
    if (typeof d === "string") {
      // try direct parse; if invalid try replace space -> T
      let dd = new Date(d);
      if (isNaN(dd)) {
        dd = new Date(d.replace(" ", "T"));
      }
      return isNaN(dd) ? null : dd;
    }
    return null;
  }

  const startDate = parseDate(start);
  const endDate = parseDate(end);

  useEffect(() => {
    setValid(!!startDate);
  }, [start]); // eslint-disable-line

  // update clock every 1s with requestAnimationFrame for smoothness
  useEffect(() => {
    function tick() {
      setNow(new Date());
      rafRef.current = window.setTimeout(() => requestAnimationFrame(tick), 1000);
    }
    tick();
    return () => {
      if (rafRef.current) {
        clearTimeout(rafRef.current);
      }
    };
  }, []);

  if (!valid) {
    return (
      <div className="p-4 bg-base-200 rounded-lg">
        <p className="text-sm text-error">Date de départ invalide</p>
      </div>
    );
  }

  // compute times
  const totalMs = endDate ? Math.max(1, endDate - startDate) : Math.max(1, startDate - now);
  const remainingMs = Math.max(0, startDate - now);
  const elapsedMs = endDate ? Math.min(Math.max(0, now - startDate), totalMs) : 0;
  const percentRemaining = endDate
    ? Math.max(0, 1 - elapsedMs / totalMs) // when there's an end, percentRemaining is 1 -> 0 across duration
    : Math.max(0, Math.min(1, remainingMs / (totalMs || 1)));
  const percentElapsed = 1 - percentRemaining;

  // nice label state
  let statusLabel = "";
  if (now < startDate) statusLabel = "À venir";
  else if (endDate && now >= startDate && now <= endDate) statusLabel = "En cours";
  else if (endDate && now > endDate) statusLabel = "Terminé";
  else if (!endDate && now >= startDate) statusLabel = "Départ passé";

  // color logic
  const percent = Math.round(percentRemaining * 100);
  let colorClass = "text-success"; // tailwind/daisy
  if (percent <= 20) colorClass = "text-error";
  else if (percent <= 50) colorClass = "text-warning";

  // format remaining time nicely
  function formatMs(ms) {
    if (ms <= 0) return "00:00:00";
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / (3600 * 24));
    const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (days > 0) return `${days}j ${String(hours).padStart(2, "0")}h`;
    return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }

  // circular progress math
  const R = (size - stroke) / 2;
  const C = 2 * Math.PI * R;
  const dash = C * percentRemaining;
  const dashGap = C - dash;

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        {/* SVG circle */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={R}
            stroke="#e6e6e6"
            strokeWidth={stroke}
            fill="none"
          />

          {/* progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={R}
            stroke="url(#g1)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${dash} ${dashGap}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: "stroke-dasharray 500ms linear, stroke 500ms linear",
            }}
          />
        </svg>

        <div className="flex flex-col items-start">
          <div className="text-sm text-gray-500">Statut</div>
          <div className={`text-lg font-semibold ${colorClass}`}>{statusLabel}</div>

          <div className="text-xs text-gray-500 mt-2">Temps restant</div>
          <div className="text-xl font-mono">{formatMs(remainingMs)}</div>

          {/* Percentage */}
          <div className="text-xs text-gray-400 mt-1"> {Math.round(percentRemaining * 100)}% restant</div>
        </div>
      </div>

      {/* If there is an end date show progress bar between start and end */}
      {endDate ? (
        <div className="w-full">
          <div className="w-full bg-base-200 h-2 rounded overflow-hidden">
            <div
              className={`h-2 rounded`}
              style={{
                width: `${Math.round(percentElapsed * 100)}%`,
                transition: "width 500ms linear",
                background: `linear-gradient(90deg,#34d399,#06b6d4)`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <div>Start: {new Date(startDate).toLocaleString()}</div>
            <div>End: {new Date(endDate).toLocaleString()}</div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-500">Départ: {new Date(startDate).toLocaleString()}</div>
      )}
    </div>
  );
}
