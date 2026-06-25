type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

const VolumeButton = ({
  children,
  onClick,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer"
    >
      {children}
    </button>
  );
};

export default VolumeButton;