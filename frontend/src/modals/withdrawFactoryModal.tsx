import {
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    Button,
    Text,
    Box,
    Input,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import PriceSelector from "../components/PriceSelector";
import { useGlobal } from "../providers/global";
import { withdrawFactory } from "../ethereum/dreamV1Protocol";
import { ethers } from "ethers";
import toast from "react-hot-toast";

interface WithdrawFactoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    maxBalance: string;
}

const regexPatterns: { [key: string]: RegExp } = {
    eth: /^\d+(\.\d{1,18})?$/,
    gwei: /^\d+(\.\d{1,9})?$/,
    wei: /^\d+$/,
};

const WithdrawFactoryModal: FC<WithdrawFactoryModalProps> = ({
    isOpen,
    onClose,
    maxBalance,
}) => {
    const { user } = useGlobal();
    const [errorMsg, setErrorMsg] = useState<string>("");
    console.log("maxBalance", maxBalance);
    const [price, setPrice] = useState<{
        amount: string;
        currency: "ETH" | "GWEI" | "WEI";
    }>({
        amount: "0",
        currency: "ETH",
    });
    const [beneficiary, setBeneficiary] = useState<string>(user?.address || "");

    const [isValid, setIsValid] = useState(false);

    const validate = () => {
        if (!user) {
            return false;
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

        if (beneficiary.length !== 42) {
            setErrorMsg("Beneficiary address is invalid");
            return false;
        }
        if (beneficiary.substring(0, 2) !== "0x") {
            setErrorMsg("Beneficiary address is invalid");
            return false;
        }

        const parsedAmount = ethers.parseUnits(
            price.amount,
            price.currency === "ETH" ? "ether" : price.currency.toLowerCase()
        );
        const maxBalanceInWei = ethers.parseUnits(maxBalance, "ether");

        if (BigInt(parsedAmount) > BigInt(maxBalanceInWei)) {
            setErrorMsg("The amount exceeds the available balance");
            return false;
        }

        setErrorMsg("");
        return true;
    };

    useEffect(() => {
        const res = validate();
        setIsValid(res);
    }, [price, maxBalance]);

    const handleOperation = async () => {
        if (!user || !isValid) {
            return;
        }

        const unit =
            price.currency === "ETH" ? "ether" : price.currency.toLowerCase();
        const parsedAmount = ethers.parseUnits(price.amount, unit);

        const res = await withdrawFactory(
            user.address,
            parsedAmount,
            beneficiary
        );
        if (!res.ok) {
            toast.error(res.message);
            return;
        }
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
                        linear(to-l, purple.600, federalBlue)
                    `}
                    fontSize={"4xl"}
                    fontWeight={"bold"}
                    bgClip="text"
                    userSelect={"none"}
                >
                    Withdraw Factory's Balance
                </ModalHeader>
                <ModalBody mx={2} px={4} rounded={"lg"}>
                    <>
                        <Box my={10}>
                            <Text color={"purple.500"}>
                                Choose the beneficiary address
                            </Text>

                            <Input
                                value={beneficiary}
                                onChange={(e) => setBeneficiary(e.target.value)}
                                placeholder={"Beneficiary Address"}
                                mt={4}
                                isInvalid={
                                    beneficiary.length !== 42 ||
                                    beneficiary.substring(0, 2) !== "0x"
                                }
                            />
                        </Box>
                        <Text color={"purple.500"}>
                            Choose the amount you want to withdraw
                        </Text>
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
                            <>
                                <Text
                                    fontSize={"sm"}
                                    marginTop={"8px"}
                                    color={"purple.500"}
                                    textAlign={"center"}
                                    _hover={{
                                        textDecoration: "underline",
                                    }}
                                    cursor={"pointer"}
                                    onClick={() => {
                                        setPrice({
                                            amount: maxBalance,
                                            currency: "ETH",
                                        });
                                    }}
                                >
                                    Max Balance Available: {maxBalance} ETH
                                </Text>
                            </>
                        </Box>
                    </>
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
                        width={"100%"}
                        cursor={!isValid ? "not-allowed" : "pointer"}
                        opacity={isValid ? 1 : 0.5}
                        bgGradient={
                            "linear(to-r, cyan.400, blue.500, purple.600)"
                        }
                        color={"white"}
                        _hover={{
                            bgGradient:
                                "linear(to-r, cyan.400, blue.400, purple.500)",
                            color: "white",
                        }}
                        onClick={() => {
                            if (!isValid || !user) {
                                return;
                            }
                            handleOperation();
                        }}
                    >
                        Withdraw Balance 💎
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default WithdrawFactoryModal;
