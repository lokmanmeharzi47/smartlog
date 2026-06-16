interface CapacityBarProps {
  value: number; // 0-100
  segments?: number;
  label?: string;
  showPercent?: boolean;
}

export default function CapacityBar({
  value,
  segments = 5,
  label,
  showPercent = true,
}: CapacityBarProps) {
  const filledCount = Math.round((value / 100) * segments);
  const isCritical = value >= 85;

  return (
    <div className="space-y-2">
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && <span className="section-label">{label}</span>}
          {showPercent && (
            <span
              className="text-xs font-semibold"
              style={{ color: isCritical ? "#BA1A1A" : "#191C1D", fontFamily: "Manrope, sans-serif" }}
            >
              {value}%
            </span>
          )}
        </div>
      )}
      <div className="capacity-bar">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`capacity-segment ${
              i < filledCount ? (isCritical ? "critical" : "filled") : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
