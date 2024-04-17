import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import MetamaskLogo from "/metamaskLogo.png";
import { useGlobal } from "../providers/global";
import { connectWallet } from "../ethereum/metamask";
import toast from "react-hot-toast";
import { getState, setState } from "../utils/storage";
import AddressCadrant from "./AddressCadrant";
import { DEFAULT_CHAINS } from "../ethereum/config";

const Connect: FC = () => {
    const { user, setToken } = useGlobal();
    const isConnected = !!getState("token");
    const isMetaMaskInstalled = !!window.ethereum;
    
    const [disabled, setDisabled] = useState(false);

    const handleConnection = async () => {
        if (disabled) {
            toast.dismiss("sign-in-request");
            toast.error("Sign in request is in progress", {
                id: "sign-in-request",
            });
            return;
        }
        if (!isMetaMaskInstalled) {
            toast.error("Metamask is not installed");
            return;
        }

        setDisabled(true);
        const result = await connectWallet();
        setDisabled(false);
        if (!result.ok || !result.data) {
            toast.error(result.message);
            return;
        }
        toast.success("Connected to Metamask");
        setState("token", result.data.token);
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
                    style={{
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.5 : 1,
                    }}
                    transition={"all 0.3s"}
                    _hover={{
                        opacity: 0.9,
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
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            userSelect={"none"}
                        >
                            Login with Metamask
                        </Text>
                    </Flex>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <AddressCadrant
                address={user?.address || ""}
                DMKBalance={user?.DMK || 0}
            />
        </Box>
    );
};

export default Connect;
