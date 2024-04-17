import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEthereum } from "../providers/ethereum";

const AddressCadrant = (props: { address: string; DMKBalance: number }) => {
    const { chainId } = useEthereum();
    return (
        <Flex alignItems={"center"} justifyContent={"center"} gap={2}>
            <Box
                p={2}
                rounded={"lg"}
                bg={"federalBlue"}
                _hover={{ cursor: "pointer" }}
                onClick={() => {
                    navigator.clipboard.writeText(props.address);
                    toast.dismiss("address-copied-toast");
                    toast.success("Address copied to clipboard", {
                        icon: "📋",
                        id: "address-copied-toast",
                        duration: 800,
                    });
                }}
            >
                <Tooltip label={props.DMKBalance + " DMK"} placement="top">
                    <Text userSelect={"none"}>
                        {props.address.substring(0, 15) + "..."}
                    </Text>
                </Tooltip>
            </Box>
                    <Box
                        p={2}
                        rounded={"lg"}
                        bg={"darkBlue"}
                        _hover={{ cursor: "pointer" }}
                        onClick={() => {
                            navigator.clipboard.writeText(chainId.toString());
                            toast.dismiss("chain-id-copied-toast");
                            toast.success("Chain ID copied to clipboard", {
                                icon: "📋",
                                id: "chain-id-copied-toast",
                                duration: 800,
                            });
                        }}
                    >
                        <Text userSelect={"none"}>{chainId}</Text>
                    </Box>
        </Flex>
    );
};

export default AddressCadrant;
