import { useRef, useState } from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
  onCommit?: (v: number) => void;
  variant?: "media" | "volume";
  duration?: number;
  showTooltip?: boolean;
  formatTooltip?: (v: number) => string;
  className?: string;
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));

const defaultFormat = (v: number, isVolume: boolean, duration: number) => {
  if (isVolume) return `${Math.round(v * 100)}%`;
  const s = Math.round(v * duration);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const Slider = ({
  value,
  onChange,
  onCommit,
  variant = "media",
  duration = 0,
  showTooltip = true,
  formatTooltip,
  className = "",
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const isVolume = variant === "volume";

  const getPercent = (clientX: number) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    return clamp((clientX - rect.left) / rect.width);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    const p = getPercent(e.clientX);
    onChange(p);
    setHover(p);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const p = getPercent(e.clientX);
    setHover(p);
    if (!isDragging) return;
    onChange(p);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const p = getPercent(e.clientX);
    onCommit?.(p);
  };

  const display = isDragging ? hover ?? value : value;

  const tooltipValue =
    hover !== null
      ? (formatTooltip?.(hover) ?? defaultFormat(hover, isVolume, duration))
      : null;

  return (
    <div
      ref={ref}
      className={`relative cursor-pointer bg-zinc-700 rounded ${
        isVolume ? "h-1 w-24" : "h-2 w-full"
      } ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setHover(null)}
    >
      <div
        className="absolute left-0 top-0 h-full bg-green-500 rounded"
        style={{ width: `${display * 100}%` }}
      />

      <div
        className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${display * 100}%` }}
      />

      {showTooltip && hover !== null && tooltipValue !== null && (
        <div
          className="absolute -top-7 text-xs bg-black text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap -translate-x-1/2"
          style={{ left: `${hover * 100}%` }}
        >
          {tooltipValue}
        </div>
      )}
    </div>
  );
};

export default Slider;