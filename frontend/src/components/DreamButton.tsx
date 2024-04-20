import { Box, Flex, Text } from "@chakra-ui/react";
import Rocket from "../illustrations/rocket";
import { Link } from "react-router-dom";

const DreamButton = () => {
    return (
        <Link to="/create-dream">
            <Box mb={5} zIndex={999}>
                <Flex
                    bgGradient={
                        "linear(to-tr, regular, darkBlue, dark, darkBlue, regular)"
                    }
                    p={5}
                    rounded={"lg"}
                    cursor={"pointer"}
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
            </Box>
        </Link>
    );
};

export default DreamButton;
