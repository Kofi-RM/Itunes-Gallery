import { useRef, useState } from "react";

type Props = {
  value: number; // 0 - 1
  onChange: (v: number) => void;
  onCommit?: (v: number) => void;

  variant?: "media" | "volume";

  showTooltip?: boolean;
  formatTooltip?: (v: number) => string;

  className?: string;
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));

const Slider = ({
  value,
  onChange,
  onCommit,
  variant = "media",
  showTooltip = true,
  formatTooltip,
  className = "",
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const isVolume = variant === "volume";

  const baseStyles = isVolume
    ? "relative h-1 w-48 rounded cursor-pointer bg-zinc-700"
    : "relative h-2 w-full rounded cursor-pointer bg-zinc-700";

  const fillColor = "bg-green-500";

  const getPercent = (clientX: number) => {
    if (!ref.current) return 0;

    const rect = ref.current.getBoundingClientRect();
    const p = (clientX - rect.left) / rect.width;

    return clamp(p);
  };

  const update = (clientX: number) => {
    const p = getPercent(clientX);
    onChange(p);
    return p;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);

    const p = update(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    setHover(p);
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
    formatTooltip?.(display) ??
    `${Math.round(display * 100)}%`;

  return (
    <div
      ref={ref}
      className={`${baseStyles} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setHover(null)}
    >
      {/* fill */}
      <div
        className={`absolute left-0 top-0 h-full rounded ${fillColor}`}
        style={{ width: `${display * 100}%` }}
      />

      {/* thumb */}
      <div
        className="
          absolute
          top-1/2
          w-4
          h-4
          bg-white
          rounded-full
          shadow
          -translate-y-1/2
          -translate-x-1/2
        "
        style={{ left: `${display * 100}%` }}
      />

      {/* tooltip */}
      {showTooltip && hover !== null && (
        <div
          className="
            absolute
            -top-7
            text-xs
            bg-black
            text-white
            px-2
            py-1
            rounded
            pointer-events-none
            whitespace-nowrap
            -translate-x-1/2
          "
          style={{ left: `${hover * 100}%` }}
        >
          {tooltipValue}
        </div>
      )}
    </div>
  );
};

export default Slider;