import MutedIcon from "../../assets/icons/MutedIcon";
import LowIcon from "../../assets/icons/LowIcon";
import MediumIcon from "../../assets/icons/MediumIcon";
import MaxIcon from "../../assets/icons/MaxIcon";


import VolumeButton from "./VolumeButton";
type Props = {
    volume: number;
    toggleMute: () => void;
   
};

const VolumeIcon = ({ volume, toggleMute }: Props) => {

    const Icon =
  volume === 0
    ? MutedIcon
    : volume < 0.5
    ? LowIcon
    : volume < 1
    ? MediumIcon
    : MaxIcon;
    // select icon based on volume

    return (
    <VolumeButton onClick={toggleMute} label={volume === 0 ? "Unmute preview" : "Mute preview"}><span aria-hidden="true"><Icon /></span></VolumeButton>
    )
}

export default VolumeIcon;
