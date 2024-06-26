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
import { boost, fund, refund, withdraw } from "../ethereum/dreamV1Protocol";
import { ethers } from "ethers";
import toast from "react-hot-toast";

interface InteractionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: string;
    colorScheme: string;
    proxyAddress: string;
    minimumFundingAmount: string;
    dreamId: string;
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

const calcMinutesOfBoost = (
    amount: string,
    currency: string,
    BASE_BOOST_DURATION: number
) => {
    const unit = currency === "ETH" ? "ether" : currency.toLowerCase();
    let parsedAmount;
    try {
        parsedAmount = ethers.parseUnits(amount, unit);
    } catch (e) {
        return "Invalid amount";
    }
    return (
        (
            (BASE_BOOST_DURATION / 1000 / 60 / 60) *
            Number(ethers.formatEther(parsedAmount))
        ).toFixed(2) + " hours of Dream Boosting"
    );
};

const InteractionModal: FC<InteractionModalProps> = ({
    isOpen,
    onClose,
    type,
    colorScheme,
    proxyAddress,
    minimumFundingAmount,
    dreamId,
}) => {
    const { user, constants } = useGlobal();
    const [errorMsg, setErrorMsg] = useState<string>("");

    const [price, setPrice] = useState<{
        amount: string;
        currency: "ETH" | "GWEI" | "WEI";
    }>({
        amount: "0",
        currency: "ETH",
    });

    const [isValid, setIsValid] = useState(false);

    const validate = () => {
        if (!user) {
            return false;
        }

        if (type === "refund" || type === "withdraw") {
            return true;
        }

        if (!price.amount.length) {
            setErrorMsg("Amount is invalid");
            return false;
        }
        if (Number(price.amount) <= 0) {
            setErrorMsg("Amount is invalid");
            return false;
        }
        if (!price.currency.length) {
            setErrorMsg("Amount is invalid");
            return false;
        }
        if (!price.amount.match(regexPatterns[price.currency.toLowerCase()])) {
            setErrorMsg("Amount is invalid");
            return false;
        }
        if (price.amount[0] === "0" && price.amount[1] !== ".") {
            setErrorMsg("Amount is invalid");
            return false;
        }

        const parsedAmount = ethers.parseUnits(
            price.amount,
            price.currency === "ETH" ? "ether" : price.currency.toLowerCase()
        );

        if (BigInt(minimumFundingAmount) > BigInt(parsedAmount)) {
            setErrorMsg("Amount is lower than the minimum funding amount");
            return false;
        }

        if (
            type === "boost" &&
            BigInt(parsedAmount) >
                ethers.parseEther(user?.DMK.toString() || "0")
        ) {
            setErrorMsg("You don't have enough DMK to perform this operation");
            return false;
        }

        setErrorMsg("");
        return true;
    };

    useEffect(() => {
        const res = validate();
        setIsValid(res);
    }, [price, type]);

    const handleOperation = async () => {
        if (!user || !isValid) {
            return;
        }

        const unit =
            price.currency === "ETH" ? "ether" : price.currency.toLowerCase();
        const parsedAmount = ethers.parseUnits(price.amount, unit);

        let res;
        switch (type) {
            case "fund":
                res = await fund(user.address, proxyAddress, parsedAmount);
                break;
            case "withdraw":
                res = await withdraw(user.address, proxyAddress);
                break;
            case "refund":
                res = await refund(user.address, proxyAddress);
                break;
            case "boost":
                res = await boost(user.address, proxyAddress, parsedAmount);
        }
        if (!res || !res.ok) {
            toast.error(res!.message || "An error occurred");
            return;
        }
        user.actionHistory.push({
            dreamId,
            action: type.toUpperCase(),
            amount: parsedAmount.toString(),
            date: new Date().toISOString(),
        });
        toast.success(
            `Transaction sent successfully, waiting for confirmation...`
        );
        onClose();
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
                    bgGradient={`
                        linear(to-l, ${colorScheme}.500, federalBlue)
                    `}
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
                                    <>
                                        <Text
                                            fontSize={"sm"}
                                            marginTop={"8px"}
                                            color={colorScheme}
                                            textAlign={"center"}
                                        >
                                            Your DMK balance:{" "}
                                            {user?.DMK
                                                ? user.DMK
                                                : "loading..."}
                                        </Text>
                                        <Text
                                            fontSize={"sm"}
                                            marginTop={"8px"}
                                            color={colorScheme}
                                            textAlign={"center"}
                                        >
                                            {calcMinutesOfBoost(
                                                price.amount,
                                                price.currency,
                                                constants.dreamBC.boostDuration
                                            )}{" "}
                                        </Text>
                                    </>
                                )}
                            </Box>
                        </>
                    )}
                    <Text
                        textAlign={"center"}
                        mb={2}
                        fontSize={"sm"}
                        mt={10}
                        color={"red"}
                    >
                        {errorMsg}
                    </Text>
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
