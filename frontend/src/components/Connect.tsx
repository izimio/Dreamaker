import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import MetamaskLogo from "/metamaskLogo.png";
import { useGlobal } from "../providers/global";
import { connectWallet } from "../ethereum/metamask";
import toast from "react-hot-toast";


const Connect: FC = () => {
    const { user, setToken } = useGlobal();
    const isConnected = !!user;
    const isMetaMaskInstalled = !!window.ethereum;

    const handleConnection = async () => {
        if (!isMetaMaskInstalled) {
            toast.error("Metamask is not installed");
            return;
        }

        const result = await connectWallet();
        if (!result.ok || !result.data) {
            toast.error(result.message);
            return;
        }
        toast.success("Connected to Metamask");
        setToken(result.data.token);
        console.log(result);
    };

    if (!isConnected) {
        return (
            <Box p={2}>
                <Box
                    rounded={"lg"}
                    color={"white"}
                    onClick={() => handleConnection()}
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
