import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import Rocket from "../illustrations/rocket";
import { Link } from "react-router-dom";

const DreamButton = ({ disabled }: { disabled: boolean }) => {
    const buttonContent = (
        <Box
            mb={5}
            zIndex={999}
            opacity={disabled ? 0.5 : 1}
            cursor={disabled ? "not-allowed" : "pointer"}
        >
            <Tooltip label={disabled ? "Login to create a dream" : ""}>
                <Flex
                    bgGradient={
                        "linear(to-tr, regular, darkBlue, dark, darkBlue, regular)"
                    }
                    p={5}
                    rounded={"lg"}
                    // cursor={"pointer"}
                    style={{
                        transition: "500ms",
                        animation: "levitate linear 4s infinite forwards",
                    }}
                    gap={5}
                    justifyContent={"center"}
                    alignItems={"center"}
                    _hover={{
                        bgGradient:
                            "linear(to-tr, regular, darkBlue, darkBlue, darkBlue, regular )",
                        "& svg": {
                            transform: "scale(1.1)",
                            animation: "rocketShake ease 5s forwards",
                        },
                    }}
                    overflow={"hidden"}
                >
                    <Text
                        textAlign={"center"}
                        fontWeight={"bold"}
                        color={"white"}
                    >
                        Start your own dream
                    </Text>
                    <Rocket size={30} />
                </Flex>
            </Tooltip>
        </Box>
    );

    if (disabled) {
        return buttonContent;
    } else {
        return (
            <Link to={"/create-dream"} style={{ textDecoration: "none" }}>
                {buttonContent}
            </Link>
        );
    }
};

export default DreamButton;
