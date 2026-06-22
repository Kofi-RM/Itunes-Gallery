import MutedIcon from "../assets/icons/MutedIcon";
import LowIcon from "../assets/icons/LowIcon";
import MediumIcon from "../assets/icons/MediumIcon";
import MaxIcon from "../assets/icons/MaxIcon";
import { useEffect } from "react";

type Props = {
    volume: number;
};

const VolumeIcon = ({ volume }: Props) => {
useEffect(() => {
        console.log(volume);
    }, [volume]);

    if (volume === 0) {
        return <MutedIcon />;
    } else if (volume < .50) {
        return <LowIcon />;
    } else if (volume < 1.0) {
        return <MediumIcon />;
    } else {
        return <MaxIcon />;
    }
}

export default VolumeIcon;
