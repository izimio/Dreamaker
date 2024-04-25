import { FC } from "react";
import { shadedColors } from "../core/Entrypoint";
import { Box, Flex, Highlight } from "@chakra-ui/react";
import token from "../illustrations/token";
import data from "../illustrations/data";
import BeanBoyUpLeft from "../illustrations/beanBoyUpLeft";

const blobMaker = (
    d: string,
    component: any,
    text: string[],
    params: {
        reverse?: boolean;
        size?: string;
    } = {
        reverse: false,
        size: "400",
    }
) => {
    const id = Math.random().toString(36).substring(7);
    const direction = params.reverse ? "row-reverse" : "row";
    const componentSize = (Number(params.size) - 110).toString();

    return (
        <Box m={20}>
            <Flex
                alignItems="center"
                justifyContent={{
                    base: "end",
                    md: params.reverse ? "end" : "start",
                }}
                flexDirection={{
                    base: "column",
                    lg: direction,
                }}
                w="100%"
                gap={5}
            >
                <Flex justifyContent="center" alignItems="center">
                    <Box
                        w={params.size + "px"}
                        h={params.size + "px"}
                        position="absolute"
                        zIndex={2}
                        scale={-1}
                    >
                        <svg
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient
                                    id={id}
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={shadedColors.dark}
                                    />
                                    <stop
                                        offset="50%"
                                        stopColor={shadedColors.federalBlue}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={shadedColors.regular}
                                    />
                                </linearGradient>
                            </defs>

                            <path
                                fill={`url(#${id})`}
                                fillOpacity="1"
                                d={d}
                                transform="translate(100 100)"
                            />
                        </svg>
                    </Box>
                    <Box zIndex={2}>
                        {component(componentSize, componentSize)}
                    </Box>
                </Flex>
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {text.map((t, i) => (
                        <Box
                            key={i}
                            w="100%"
                            style={{
                                width: "70%",
                                textAlign: params.reverse ? "justify" : "start",
                                fontSize: "1.5em",
                            }}
                        >
                            <Highlight
                                query={["Dreamaker", "blockchain", "DMK"]}
                                styles={{
                                    fontWeight: "bold",
                                    color: shadedColors.regular,
                                }}
                            >
                                {t}
                            </Highlight>
                            <br />
                            <br />
                        </Box>
                    ))}
                </Box>
            </Flex>
        </Box>
    );
};
const HomeHero: FC = () => {
    const infos = {
        one: {
            d: "M39.3,-45.8C54.7,-42.8,73.8,-36.5,76.6,-25.4C79.4,-14.4,66,1.3,60.1,19.6C54.3,37.9,56,58.7,47.3,65.4C38.5,72.2,19.3,64.8,2.4,61.6C-14.5,58.3,-29.1,59.2,-41.8,53.7C-54.6,48.3,-65.6,36.6,-73.9,21.5C-82.2,6.5,-87.7,-11.9,-83.3,-27.5C-78.8,-43,-64.3,-55.8,-48.7,-58.8C-33.2,-61.8,-16.6,-55,-2.4,-51.8C11.9,-48.5,23.8,-48.8,39.3,-45.8Z",
            component: BeanBoyUpLeft,
            text: [
                "Welcome to Dreamaker, where dreams become reality through decentralized crowdfunding.",
                "Empower your aspirations with the support of our vibrant community, all powered by the blockchain as the ultimate arbiter of trust.",
                "Whether you're a seasoned visionary or a first-time dreamer, you have the ability to bring your ideas to life without needing any coding expertise.",
                "Join us and embark on the journey to manifest your dreams today.",
            ],
        },
        two: {
            d: "M50,-65.4C64.8,-58,76.8,-43.5,80.2,-27.4C83.6,-11.4,78.2,6.2,71,21.3C63.7,36.5,54.4,49.3,42.2,60C30.1,70.7,15,79.3,0.6,78.5C-13.9,77.7,-27.8,67.6,-42.9,57.8C-58,48.1,-74.2,38.7,-82.3,24.3C-90.3,9.8,-90.2,-9.7,-84.3,-27.3C-78.4,-44.8,-66.8,-60.4,-51.8,-67.7C-36.8,-75.1,-18.4,-74.2,-0.4,-73.7C17.6,-73.1,35.2,-72.9,50,-65.4Z",
            component: data,
            text: [
                "Dreamaker's token is a decentralized cryptocurrency that allows you to buy and sell dreams.",
                "DMK tokens are the currency of the Dreamaker protocol.",
            ],
        },
        three: {
            d: "M48.1,-67.1C60.8,-56.9,68.6,-40.9,72.5,-24.5C76.4,-8.2,76.5,8.3,70.6,21.9C64.7,35.4,52.8,45.9,40.1,53.8C27.3,61.8,13.6,67.2,0.1,67C-13.4,66.8,-26.7,61,-38.3,52.7C-49.8,44.3,-59.5,33.4,-64.7,20.4C-69.9,7.3,-70.4,-7.9,-65.2,-20.3C-59.9,-32.7,-48.8,-42.3,-37,-52.8C-25.1,-63.2,-12.6,-74.6,2.6,-78.1C17.7,-81.6,35.3,-77.3,48.1,-67.1Z",
            component: token,
            text: [
                "Using the Dreamaker protocol, you leverage the power of the blockchain to empower your and your community's dreams.",
                "Dremaker's decentralized protocol makes your earn DMK tokens on every dreams achieved.",
            ],
        },
    };

    return (
        <Box w="100%" h="100%">
            <Box w="100%" h="100%" justifyContent="start">
                {blobMaker(infos.one.d, infos.one.component, infos.one.text, {
                    size: "600",
                    reverse: true,
                })}
                {blobMaker(infos.two.d, infos.two.component, infos.two.text, {
                    size: "550",
                })}
                {blobMaker(
                    infos.three.d,
                    infos.three.component,
                    infos.three.text,
                    {
                        size: "600",
                        reverse: true,
                    }
                )}
            </Box>
        </Box>
    );
};

export default HomeHero;
