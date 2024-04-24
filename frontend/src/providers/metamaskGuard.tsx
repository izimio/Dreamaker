import { Box, Center, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";

import metamaskLogo from "/metamaskLogo.png";

interface Props {
    children: JSX.Element;
}

const MetamaskGuard: FC<Props> = ({ children }) => {
    if (!window.ethereum) {
        return (
            <Box
                h="100vh"
                w="100vw"
                bg="black"
                color="white"
                p={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Stack spacing={4} textAlign="center" alignItems="center">
                    <Heading>Metamask not found 😢</Heading>
                    <img
                        src={metamaskLogo}
                        alt={"metamask logo"}
                        style={{
                            width: "200px",
                            height: "200px",
                            textAlign: "center",
                        }}
                    />
                    <Text>
                        Dreamaker requires Metamask to be installed in order to
                        work
                    </Text>
                    <Text>Please install Metamask and refresh the page</Text>
                    <a href="https://metamask.io/download/" target="_blank">
                        <Box p={2}>
                            <Box
                                rounded={"lg"}
                                color={"white"}
                                bgGradient={
                                    "linear(to-r, metamaskWhite, metamaskLight, metamaskDark)"
                                }
                                bg={"#f89d49"}
                                cursor={"pointer"}
                                transition={"all 0.3s"}
                                _hover={{
                                    opacity: 0.9,
                                }}
                                gap={2}
                            >
                                <Flex alignItems="center" p={2}>
                                    <img
                                        src={metamaskLogo}
                                        alt="Metamask"
                                        style={{
                                            height: "30px",
                                            width: "auto",
                                            userSelect: "none",
                                        }}
                                    />
                                    <Text
                                        fontSize="md"
                                        fontWeight="bold"
                                        userSelect={"none"}
                                    >
                                        Install Metamask here
                                    </Text>
                                </Flex>
                            </Box>
                        </Box>
                    </a>
                </Stack>
            </Box>
        );
    }
    return children;
};

export default MetamaskGuard;
