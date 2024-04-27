import {
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    Button,
    Text,
    Box,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import PriceSelector from "../components/PriceSelector";
import { useGlobal } from "../providers/global";
import { boost } from "../ethereum/dreamV1Protocol";
import { ethers } from "ethers";
import toast from "react-hot-toast";

interface InteractionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: string;
    colorScheme: string;
    proxyAddress: string;
}

const descriptions: {
    [key: string]: string;
} = {
    fund: "By funding this dream you will be able to help the dreamer to reach his goal.",
    withdraw:
        "Congratulations! You have reached your goal, you can now withdraw your funds.",
    refund: "Sadly, the dreamer has not reached his goal, you can now refund your funds.",
    boost: "Boosting a dream will make it more visible to other users by putting it on the top of dreams list.",
};

const title: {
    [key: string]: string;
} = {
    fund: "Fund this dream",
    withdraw: "Withdraw your funds",
    refund: "Refund your funds",
    boost: "Boost this dream",
};

const priceText: {
    [key: string]: string;
} = {
    fund: "Amount to fund",
    refund: "Amount to refund",
    boost: "Amount to boost converted in DMK",
};

const emojis: {
    [key: string]: string;
} = {
    fund: "🎁",
    withdraw: "💎",
    refund: "💸",
    boost: "🚀",
};

const regexPatterns: { [key: string]: RegExp } = {
    eth: /^\d+(\.\d{1,18})?$/,
    gwei: /^\d+(\.\d{1,9})?$/,
    wei: /^\d+$/,
};

const InteractionModal: FC<InteractionModalProps> = ({
    isOpen,
    onClose,
    type,
    colorScheme,
    proxyAddress,
}) => {
    const { user } = useGlobal();
    const [price, setPrice] = useState<{
        amount: string;
        currency: "ETH" | "GWEI" | "WEI";
    }>({
        amount: "0",
        currency: "ETH",
    });

    const [isValid, setIsValid] = useState(false);

    const validate = () => {
        if (type === "refund" || type === "withdraw") {
            return true;
        }

        if (!price.amount.length) {
            return false;
        }
        if (Number(price.amount) <= 0) {
            return false;
        }
        if (!price.currency.length) {
            return false;
        }
        if (!price.amount.match(regexPatterns[price.currency.toLowerCase()])) {
            return false;
        }
        if (price.amount[0] === "0" && price.amount[1] !== ".") {
            return false;
        }
        return true;
    };

    useEffect(() => {
        const res = validate();
        setIsValid(res);
    }, [price]);

    const handleOperation = async () => {
        if (!user || !isValid) {
            return;
        }

        const unit =
            price.currency === "ETH" ? "ether" : price.currency.toLowerCase();
        const parsedAmount = ethers.parseUnits(price.amount, unit);

        if (
            type === "boost" &&
            BigInt(parsedAmount) > ethers.parseEther(user.DMK.toString())
        ) {
            toast.error("You don't have enough DMK");
            return;
        }

        switch (type) {
            case "fund":
                console.log("fund");
                break;
            case "withdraw":
                console.log("withdraw");
                break;
            case "refund":
                console.log("refund");
                break;
            case "boost":
                boost(user.address, proxyAddress, parsedAmount);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onClose();
            }}
            isCentered={true}
            size={"xl"}
        >
            <ModalOverlay />
            <ModalContent pb={4}>
                <ModalHeader
                    textAlign={"center"}
                    bgGradient={"linear(to-bl, light, federalBlue)"}
                    fontSize={"4xl"}
                    fontWeight={"bold"}
                    bgClip="text"
                    userSelect={"none"}
                >
                    {title[type]}{" "}
                    <span
                        style={{
                            color: "black",
                        }}
                    >
                        {" "}
                        {emojis[type]}
                    </span>
                    <Text fontSize={"md"} fontWeight={"bold"} mt={2}>
                        {descriptions[type]}
                    </Text>
                </ModalHeader>
                <ModalBody mx={2} px={4} rounded={"lg"}>
                    {(type === "boost" || type === "fund") && (
                        <>
                            <Text color={colorScheme}>{priceText[type]}</Text>
                            <Box
                                mb={4}
                                __css={{
                                    "* > *": {
                                        color: "black",
                                        borderColor: "black !important",
                                    },
                                    "* > *:hover": {
                                        color: "black",
                                        borderColor: "black !important",
                                    },
                                    "* > *:focus": {
                                        color: "black",
                                        borderColor: "black",
                                    },
                                    "* > *:active": {
                                        color: "black",
                                        borderColor: "",
                                    },
                                }}
                            >
                                <PriceSelector
                                    price={price}
                                    setPrice={setPrice}
                                    isInvalid={!isValid}
                                    showText={false}
                                />
                                {type === "boost" && (
                                    <Text
                                        fontSize={"sm"}
                                        marginTop={"8px"}
                                        color={colorScheme}
                                        textAlign={"center"}
                                    >
                                        Your DMK balance:{" "}
                                        {user?.DMK ? user.DMK : "loading..."}
                                    </Text>
                                )}
                            </Box>
                        </>
                    )}
                    <Button
                        colorScheme={colorScheme}
                        width={"100%"}
                        cursor={!isValid ? "not-allowed" : "pointer"}
                        opacity={isValid ? 1 : 0.5}
                        _hover={{
                            opacity: isValid ? 0.9 : 0.5,
                        }}
                        onClick={() => {
                            if (!isValid || !user) {
                                return;
                            }
                            handleOperation();
                        }}
                    >
                        {type} {emojis[type]}
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default InteractionModal;
