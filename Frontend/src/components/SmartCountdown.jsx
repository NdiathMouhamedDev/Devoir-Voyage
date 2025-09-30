import React, { useEffect, useState, useRef } from "react";


export default function SmartCountdown({ start, end = null, size = 140, stroke = 10 }) {
  const [now, setNow] = useState(new Date());
  const [valid, setValid] = useState(true);
  const rafRef = useRef(null);

  // Parse robuste: supporte Date, ISO, MySQL format et fr-FR
  function parseDate(d) {
    if (!d) return null;
    if (d instanceof Date) return d;
    if (typeof d !== "string") return null;

    // Format fr-FR: "25/09/2025" ou "25/09/2025 14:30:00"
    const frRegex = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}):(\d{2}))?$/;
    const frMatch = d.trim().match(frRegex);
    if (frMatch) {
      const [, day, month, year, hour = "00", minute = "00", second = "00"] = frMatch;
      const isoStr = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
      const date = new Date(isoStr);
      return isNaN(date) ? null : date;
    }

    // Format MySQL: "2025-09-25 14:30:00"
    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(d.trim())) {
      const date = new Date(d.replace(" ", "T"));
      return isNaN(date) ? null : date;
    }

    // Format MySQL sans heure: "2025-09-25"
    if (/^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
      const date = new Date(d + "T00:00:00");
      return isNaN(date) ? null : date;
    }

    // Format ISO standard
    const date = new Date(d);
    return isNaN(date) ? null : date;
  }

  const startDate = parseDate(start);
  const endDate = parseDate(end);

  useEffect(() => {
    setValid(!!startDate);
  }, [start]);

  // Update clock every 1s
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

  if (!valid || !startDate) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-sm text-red-600">⚠️ Date de départ invalide</p>
      </div>
    );
  }

  // Compute times
  const totalMs = endDate ? Math.max(1, endDate - startDate) : Math.max(1, startDate - now);
  const remainingMs = Math.max(0, startDate - now);
  const elapsedMs = endDate ? Math.min(Math.max(0, now - startDate), totalMs) : 0;
  const percentRemaining = endDate
    ? Math.max(0, 1 - elapsedMs / totalMs)
    : Math.max(0, Math.min(1, remainingMs / (totalMs || 1)));
  const percentElapsed = 1 - percentRemaining;

  // Status label
  let statusLabel = "";
  if (now < startDate) statusLabel = "À venir";
  else if (endDate && now >= startDate && now <= endDate) statusLabel = "En cours";
  else if (endDate && now > endDate) statusLabel = "Terminé";
  else if (!endDate && now >= startDate) statusLabel = "Départ passé";

  // Color logic
  const percent = Math.round(percentRemaining * 100);
  let colorClass = "text-green-600";
  if (percent <= 20) colorClass = "text-red-600";
  else if (percent <= 50) colorClass = "text-orange-500";

  // Format remaining time
  function formatMs(ms) {
    if (ms <= 0) return "00:00:00";
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / (3600 * 24));
    const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (days > 0) return `${days}j ${String(hours).padStart(2, "0")}h`;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  // Circular progress math
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

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={R}
            stroke="#e6e6e6"
            strokeWidth={stroke}
            fill="none"
          />

          {/* Progress circle */}
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

          <div className="text-xs text-gray-400 mt-1">{percent}% restant</div>
        </div>
      </div>

      {/* Progress bar if end date exists */}
      {endDate ? (
        <div className="w-full">
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div
              className="h-2 rounded"
              style={{
                width: `${Math.round(percentElapsed * 100)}%`,
                transition: "width 500ms linear",
                background: "linear-gradient(90deg,#34d399,#06b6d4)",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <div>Début: {startDate.toLocaleDateString("fr-FR", { 
              day: "2-digit", 
              month: "2-digit", 
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}</div>
            <div>Fin: {endDate.toLocaleDateString("fr-FR", { 
              day: "2-digit", 
              month: "2-digit", 
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}</div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-500">
          Départ: {startDate.toLocaleDateString("fr-FR", { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>
      )}
    </div>
  );
}