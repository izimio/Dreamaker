import { Box, Flex, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import MetamaskLogo from "/metamaskLogo.png";
import { useGlobal } from "../providers/global";
import { connectWallet } from "../ethereum/metamask";
import toast from "react-hot-toast";
import { getState, setState } from "../utils/storage";
import AddressCadrant from "./AddressCadrant";
import { useModals } from "../providers/modals";

const Connect: FC = () => {
    const { user, setToken } = useGlobal();
    const { switchChallengeModal } = useModals();

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

        const result = await connectWallet();
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
                    onClick={() => {
                        setDisabled(true);
                        switchChallengeModal(true);
                        handleConnection().then(() => {
                            setDisabled(false);
                            switchChallengeModal(false);
                        });
                    }}
                    bgGradient={
                        "linear(to-r, metamaskWhite, metamaskLight, metamaskDark)"
                    }
                    bg={"#f89d49"}
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
