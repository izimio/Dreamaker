import { Box, Container, Flex, Input, Spinner, Text } from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";
import Rocket from "../../illustrations/rocket";

interface StepperFinalProps {
    setValideStep: (f: boolean) => void;
}

const StepperFinal: FC<StepperFinalProps> = ({ setValideStep }) => {
    const rocketRef = useRef(null);
    const [isRocketLaunched, setIsRocketLaunched] = useState(false);
    const validate = () => {
        setValideStep(true);
        return true;
    };

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
        if (isRocketLaunched) {
            return;
        }
        setIsRocketLaunched(true);
        if (rocketRef.current.style.animation.includes("flyHigh")) {
            return;
        }
        rocketRef.current.style.animation = "flyHigh 7s ease forwards";
    };

    useEffect(() => {
        validate();
    }, []);

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
                        {/* {BeanBoyStepThree()} */}
                        <Flex
                            flexDirection="column"
                            alignItems="center"
                            p={5}
                            gap={5}
                        >
                            <Box ref={rocketRef}>
                                <Rocket size={100} ref={rocketRef} />
                            </Box>
                            {isRocketLaunched && (
                                <Spinner
                                    thickness="4px"
                                    speed="0.65s"
                                    emptyColor="federalBlue"
                                    color="cyan"
                                    size="xl"
                                />
                            )}
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
