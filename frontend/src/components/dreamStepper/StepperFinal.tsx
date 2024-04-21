import { Box, Container, Flex, Spinner, Text } from "@chakra-ui/react";
import { FC, useRef, useState } from "react";
import Rocket from "../../illustrations/rocket";

interface StepperFinalProps {
    onLaunch: () => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
}

const StepperFinal: FC<StepperFinalProps> = ({
    onLaunch,
    isLoading,
    setIsLoading,
}) => {
    const rocketRef = useRef({} as HTMLDivElement);
    const [isRocketLaunched, setIsRocketLaunched] = useState(false);

    const onTextHovered = () => {
        if (isRocketLaunched) {
            return;
        }
        rocketRef.current.style.animation =
            "wiggle 1.5s infinite linear forwards";
    };

    const onTextLeave = () => {
        if (isRocketLaunched) {
            return;
        }
        rocketRef.current.style.animation = "";
    };

    const onLaunchClicked = () => {
        // if (isRocketLaunched) {
        //     return;
        // }
        rocketRef.current.style.animation = "flyHigh 5s ease forwards";

        setIsRocketLaunched(true);
        setTimeout(() => {
            setIsLoading(true);
            onLaunch();
        }, 2000);
    };

    return (
        <Container maxW="container.sm">
            <Box>
                <Text
                    color={"white"}
                    textShadow={" 1px 1px 1px cyan"}
                    fontSize="2xl"
                    textAlign={"center"}
                >
                    Launch your dream for the world to see!
                </Text>
                <Box mt={4} padding={4}>
                    <Flex
                        justifyContent="space-evenly"
                        alignItems="center"
                        flexWrap="wrap"
                    >
                        <Flex
                            flexDirection="column"
                            alignItems="center"
                            p={5}
                            gap={5}
                        >
                            <Box ref={rocketRef}>
                                <Rocket size={100} />
                            </Box>
                            {isLoading && (
                                <Spinner
                                    thickness="4px"
                                    speed="0.65s"
                                    emptyColor="federalBlue"
                                    color="cyan"
                                    size="xl"
                                />
                            )}
                            {isLoading}
                            <Text
                                color={"white"}
                                textShadow={" 1px 1px 1px cyan"}
                                textAlign={"center"}
                                rounded="lg"
                                p={5}
                                transition={"all 1s"}
                                bgGradient="transparent"
                                border={"2px solid transparent"}
                                _hover={
                                    isRocketLaunched
                                        ? {}
                                        : {
                                              cursor: "pointer",

                                              bg: "fedralBlue",
                                              border: "2px solid white",
                                              textShadow: "1px 1px 5px white",
                                          }
                                }
                                fontSize="2xl"
                                onMouseOver={onTextHovered}
                                onMouseLeave={onTextLeave}
                                onClick={onLaunchClicked}
                            >
                                {isRocketLaunched
                                    ? "Launching..."
                                    : "Launch Dream"}
                            </Text>
                        </Flex>
                    </Flex>
                </Box>
            </Box>
        </Container>
    );
};

export default StepperFinal;
