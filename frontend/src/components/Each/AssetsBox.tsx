import { Box, Flex, Image } from "@chakra-ui/react";
import { FC } from "react";
import defaultImage from "/assets_fallback.jpg";
import { useModals } from "../../providers/modals";

interface AssetsBoxProps {
    assets: { type: string; link: string }[];
}

const AssetsBox: FC<AssetsBoxProps> = ({ assets }) => {
    const { switchPictureModal } = useModals();
    if (!assets.length) {
        assets.push({ type: "image", link: defaultImage });
    }
    return (
        <Box w={"80%"} h={"100%"} overflow={"hidden"} rounded={"lg"}>
            <Flex
                wrap={"wrap"}
                h={"100%"}
                w={"100%"}
                gap={1}
                justifyContent={"space-between"}
            >
                {assets.map((asset, index) => {
                    const numAssets = assets.length;
                    let width = "49%";
                    let height = "49%";

                    if (numAssets === 1) {
                        height = "100%";
                        width = "100%";
                    }
                    if (numAssets === 2) {
                        height = "49%";
                        width = "100%";
                    }
                    if (numAssets == 3) {
                        height = "49%";
                    }
                    if (numAssets == 5) {
                        height = "33%";
                    }

                    if (numAssets % 2 === 1 && index === numAssets - 1) {
                        width = "100%";
                    }

                    if (asset.type.includes("image")) {
                        return (
                            <Image
                                key={index}
                                src={asset.link}
                                alt={"Dream image"}
                                w={width}
                                h={height}
                                objectFit={"cover"}
                                onClick={() => {
                                    switchPictureModal(asset.link);
                                }}
                            />
                        );
                    } else if (asset.type.includes("video")) {
                        return (
                            <video
                                key={index}
                                width={width}
                                height={height}
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
