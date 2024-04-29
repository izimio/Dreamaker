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
import { changeMinFundingAmount } from "../ethereum/dreamV1Protocol";
import { ethers } from "ethers";
import toast from "react-hot-toast";

interface InteractionModalProps {
    isOpen: boolean;
    onClose: () => void;
    proxyAddress: string;
    minimumFundingAmount: string;
}

const regexPatterns: { [key: string]: RegExp } = {
    eth: /^\d+(\.\d{1,18})?$/,
    gwei: /^\d+(\.\d{1,9})?$/,
    wei: /^\d+$/,
};

const EditMinFundingAmountModal: FC<InteractionModalProps> = ({
    isOpen,
    onClose,
    proxyAddress,
    minimumFundingAmount,
}) => {
    const { user } = useGlobal();

    const [price, setPrice] = useState<{
        amount: string;
        currency: "ETH" | "GWEI" | "WEI";
    }>({
        amount: minimumFundingAmount,
        currency: "WEI",
    });

    useEffect(() => {
        setPrice({
            amount: minimumFundingAmount,
            currency: "WEI",
        });
    }, [isOpen]);

    const [isValid, setIsValid] = useState(false);

    const validate = () => {
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

        const parsedAmount = ethers.parseUnits(
            price.amount,
            price.currency === "ETH" ? "ether" : price.currency.toLowerCase()
        );

        if (BigInt(parsedAmount) <= 0n) {
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

        const res = await changeMinFundingAmount(
            user.address,
            proxyAddress,
            ethers.parseUnits(
                price.amount,
                price.currency === "ETH"
                    ? "ether"
                    : price.currency.toLowerCase()
            )
        );
        if (!res || !res.ok) {
            toast.error(res!.message || "An error occurred");
            return;
        }
        toast.success(
            `Transaction sent successfully, modifications will be visible soon...\n
            tx: ${res.data}`,
            {
                duration: 50000,
                icon: "⛓️",
            }
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
            size={"2xl"}
        >
            <ModalOverlay />
            <ModalContent pb={4}>
                <ModalHeader
                    textAlign={"center"}
                    bgGradient={`
                        linear(to-l, cyan.500, federalBlue)
                    `}
                    fontSize={"4xl"}
                    fontWeight={"bold"}
                    bgClip="text"
                    userSelect={"none"}
                >
                    Edit Minimum Funding Amount
                    <Text fontSize={"md"} fontWeight={"bold"} mt={2}>
                        {`Current Minimum Funding Amount: ${minimumFundingAmount} ETH`}
                    </Text>
                </ModalHeader>
                <ModalBody mx={2} px={4} rounded={"lg"}>
                    <>
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
                        </Box>
                    </>
                    <Button
                        colorScheme={"cyan"}
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
                        Update Minimum Funding Amount
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditMinFundingAmountModal;
