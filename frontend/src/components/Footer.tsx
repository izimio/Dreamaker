import { Avatar, Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { FC } from "react";
import wizard from "../illustrations/wizard";
import bg from "/bg.png";

const Wave: FC = () => {
    const LIGHT = "#4AE3CB";
    const DARKBLUE = "#000054";
    const DARK = "#00003A";

    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 230"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={DARK} />
                    <stop offset="50%" stopColor={DARKBLUE} />
                    <stop offset="100%" stopColor={LIGHT} />
                </linearGradient>
            </defs>

            <path
                fill="url(#gradient)"
                fillOpacity="1"
                d="M0,160L60,144C120,128,240,96,360,90.7C480,85,600,107,720,138.7C840,171,960,213,1080,218.7C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
        </svg>
    );
};

const Footer: FC = () => {
    return (
        <Box
            bottom={0}
            left={0}
            position={"relative"}
            w={"100%"}
            overflow={"hidden"}
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundRepeat: "repeat",
                backgroundPosition: "center",
                backgroundPositionX: "start",
                backgroundPositionY: "revert",
            }}
        >
            <Box zIndex={-1}>
                <Wave />
            </Box>
            <Box
                bgGradient={"linear(to-l, light, darkBlue, dark)"}
                color="white"
            >
                <Flex
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    flexDirection={{
                        base: "column",
                        md: "row",
                    }}
                >
                    <Flex
                        justifyContent={"space-evenly"}
                        alignItems={"center"}
                        zIndex={10}
                        mt={{
                            base: 0,
                            md: -20,
                        }}
                        flexDirection={{
                            base: "column",
                            md: "row",
                        }}
                    >
                        <Box
                            style={{
                                transition: "500ms",
                                borderRadius: "70%",
                                boxShadow: "2px 2px 100px 2px #4AE3CB",
                                cursor: "pointer",
                            }}
                            _hover={{
                                boxShadow:
                                    "2px 2px 100px 15px #4AE3CB !important",
                            }}
                            onClick={() =>
                                window.open(
                                    "https://www.linkedin.com/in/joshua-brionne/"
                                )
                            }
                        >
                            <Avatar
                                src="https://avatars.githubusercontent.com/u/65503390?v=4"
                                size={"2xl"}
                            />
                        </Box>
                        <Box w={"50%"}>
                            <Text fontSize="xl" fontWeight="bold" mb={2}>
                                Dreamaker:
                            </Text>
                            <Text fontSize="sm">
                                <strong>Dreamaker</strong> is a platform for
                                dreamers to connect and share their dreams.
                            </Text>
                            <Text>
                                It was concept, created and debugged with ❤️ and
                                passion by Izimio for the Alchemy's Bootcamp
                                Final Project.
                            </Text>
                        </Box>
                    </Flex>
                    <Tooltip
                        label="Psstt: Click on me"
                        placement="start"
                        bg={"dark"}
                    >
                        <Box
                            style={{
                                transition: "500ms",
                                transform: "translateY(50px) translateX(-50px)",
                                borderRadius: "70%",
                            }}
                            _hover={{
                                cursor: "pointer",
                                transform:
                                    "translateY(20px) translateX(-50px) !important",
                                boxShadow: "10px 10px 100px 50px #000054",
                                backgroundColor: "dark",
                            }}
                            onClick={() =>
                                window.open(
                                    "https://github.com/izimio/Dreamaker"
                                )
                            }
                        >
                            {wizard("150", "150")}
                        </Box>
                    </Tooltip>
                </Flex>
            </Box>
        </Box>
    );
};

export default Footer;
