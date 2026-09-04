type Props = {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
};

const VolumeButton = ({
  children,
  onClick,
  label,
}: Props) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="cursor-pointer min-w-11 min-h-11 flex items-center justify-center rounded-lg bg-zinc-800"
    >
      {children}
    </button>
  );
};

export default VolumeButton;
