import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import MetamaskLogo from "/metamaskLogo.png";
import { useGlobal } from "../providers/global";
import { connectWallet } from "../ethereum/metamask";

const Connect: FC = () => {
    const { user } = useGlobal();
    const isConnected = !!user;

    if (!isConnected) {
        return (
            <Box p={2}>
                <Box
                    rounded={"lg"}
                    color={"white"}
                    onClick={() => connectWallet()}
                    bgGradient={
                        "linear(to-r, metamaskWhite, metamaskLight, metamaskDark)"
                    }
                    transition={"all 0.3s"}
                    _hover={{
                        opacity: 0.9,
                        cursor: "pointer",
                    }}
                    gap={2}
                >
                    <Flex alignItems="center" p={2}>
                        <img
                            src={MetamaskLogo}
                            alt="Metamask"
                            style={{
                                height: "30px",
                                width: "auto",
                                userSelect: "none",
                            }}
                        />
                        <Text fontSize="md" fontWeight="bold" userSelect={"none"}>
                            Login with Metamask
                        </Text>
                    </Flex>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <Text fontSize="xl" fontWeight="bold">
                Connected as {user?.address}
            </Text>
        </Box>
    );
};

export default Connect;
