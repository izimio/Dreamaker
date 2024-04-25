import { Box, Flex, Image } from "@chakra-ui/react";
import { FC } from "react";
import defaultImage from "/assets_fallback.jpg";

interface AssetsBoxProps {
    assets: { type: string; link: string }[];
}

const AssetsBox: FC<AssetsBoxProps> = ({ assets }) => {
    if (!assets.length) {
        assets.push({ type: "image", link: defaultImage });
    }
    return (
        <Box w={"80%"} h={"100%"}>
            <Flex wrap={"wrap"} h={"100%"} w={"100%"}>
                {assets.map((asset, index) => {
                    const width =
                        index % 2 == 0 && assets.length == index + 1
                            ? "100%"
                            : "50%";
                    console.log(width);
                    if (asset.type.includes("image")) {
                        return (
                            <Image
                                key={index}
                                src={asset.link}
                                alt={"Dream image"}
                                w={width}
                                h={"50%"}
                                objectFit={"contain"}
                            />
                        );
                    } else if (asset.type.includes("video")) {
                        return (
                            <video
                                key={index}
                                width={width}
                                height={"50%"}
                                controls
                            >
                                <source src={asset.link} type="video/mp4" />
                            </video>
                        );
                    }
                })}
            </Flex>
        </Box>
    );
};

export default AssetsBox;
