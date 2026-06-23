import MutedIcon from "../assets/icons/MutedIcon";
import LowIcon from "../assets/icons/LowIcon";
import MediumIcon from "../assets/icons/MediumIcon";
import MaxIcon from "../assets/icons/MaxIcon";
import { useEffect } from "react";

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

useEffect(() => {
        console.log(volume);
        
    }, [volume]);

    return (
    <VolumeButton onClick={toggleMute}><Icon></Icon></VolumeButton>
    )
}

export default VolumeIcon;
