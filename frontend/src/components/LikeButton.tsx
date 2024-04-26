import { FC, useRef, useState } from "react";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Icon } from "@chakra-ui/react";

interface LikeButtonProps {
    liked: boolean;
    callback: () => void;
}

const LikeButton: FC<LikeButtonProps> = ({
    liked,
    callback,
}: LikeButtonProps) => {
    const ref = useRef(null);

    const handleCallback = () => {
        if (!liked) {
            ref.current.style.animation = "like 0.5s ease 1";
        } else {
            ref.current.style.animation = "unlike 0.5s ease 1";
        }
        setTimeout(() => {
            ref.current.style.animation = "none";
            callback();
        }, 500);
    };

    const icon = liked ? FavoriteIcon : FavoriteBorderIcon;
    return (
        <Icon
            as={icon}
            onClick={() => {
                ref.current.style.animation = "none";
                handleCallback();
            }}
            color={"red"}
            ml={"4"}
            cursor={"pointer"}
            ref={ref}
        />
    );
};

export default LikeButton;
