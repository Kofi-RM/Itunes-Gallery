type Props = {
  value: number;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  variant?: "media" | "volume";
  duration?: number;
  showTooltip?: boolean;
  formatTooltip?: (value: number) => string;
  className?: string;
};

export default function Slider({ value, onChange, onCommit, variant = "media",
  duration = 0, showTooltip = true, formatTooltip, className = "" }: Props) {
  const normalized = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  const volume = variant === "volume";
  const seconds = Math.floor(normalized * Math.max(0, duration));
  const description = formatTooltip?.(normalized) ?? (volume
    ? `${Math.round(normalized * 100)}%`
    : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`);
  return <input type="range" min={0} max={1} step={0.01} value={normalized}
    aria-label={volume ? "Volume" : "Playback position"}
    aria-valuetext={description}
    title={showTooltip ? description : undefined}
    disabled={!volume && (!Number.isFinite(duration) || duration <= 0)}
    onChange={(event) => onChange(Number(event.currentTarget.value))}
    onPointerUp={(event) => onCommit?.(Number(event.currentTarget.value))}
    onKeyUp={(event) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(event.key)) {
        onCommit?.(Number(event.currentTarget.value));
      }
    }}
    className={`h-11 min-w-0 cursor-pointer accent-green-500 ${volume ? "w-24" : "w-full"} ${className}`} />;
}
