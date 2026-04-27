"use client";

export default function SimpleChart({ data = [], label, color = "var(--primary)", maxValue, type = "bar" }) {
  if (!data.length) return null;

  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  if (type === "bar") {
    return (
      <div>
        {label && (
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            {label}
          </p>
        )}
        <div className="flex items-end gap-2 h-28">
          {data.map((d, i) => {
            const height = Math.max((d.value / max) * 100, 4);
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>
                  {d.value}
                </span>
                <div className="w-full flex items-end" style={{ height: "80px" }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(to top, ${color}, ${color}88)`,
                      animationDelay: `${i * 60}ms`,
                    }}
                  />
                </div>
                <span className="text-[9px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                  {d.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Line chart (simple SVG)
  const width = 300;
  const height = 80;
  const padding = 10;
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => ({
    x: padding + i * stepX,
    y: height - padding - ((d.value / max) * (height - padding * 2)),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
          {label}
        </p>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: "100px" }}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#grad-${label})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" stroke={color} strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between px-1 mt-1">
        {data.map((d, i) => (
          <span key={i} className="text-[9px] font-medium" style={{ color: "var(--text-tertiary)" }}>
            {d.date}
          </span>
        ))}
      </div>
    </div>
  );
}
