import { Box, Container, Flex } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import PriceSelector from "../PriceSelector";

interface StepperPriceProps {
    price: {
        amount: string;
        currency: "ETH" | "GWEI" | "WEI";
    };
    setPrice: (price: { amount: string; currency: "ETH" | "GWEI" | "WEI" }) => void;
    setValideStep: (f: boolean) => void;
}

const regexPatterns: { [key: string]: RegExp } = {
    ethers: /^\d+(\.\d+)?/,
    gwei: /^\d+(\.\d+)?/,
    wei: /^\d+/,
};

const StepperPrice: FC<StepperPriceProps> = ({
    price,
    setPrice,
    setValideStep,
}) => {
    const [isValid, setIsValid] = useState(false);

    const validate = () => {
        if (!price.amount.length) {
            setValideStep(false);
            return false;
        }
        if(Number(price.amount) <= 0) {
            setValideStep(false);
            return false;
        }
        if (!price.currency.length) {
            setValideStep(false);
            return false;
        }
        if (!price.amount.match(regexPatterns[price.currency])) {
            setValideStep(false);
            return false;
        }
        if(price.amount[0] === "0" && price.amount[1] !== ".") {
            setValideStep(false);
            return false;
        }
        setValideStep(true);
        return true;
    };

    useEffect(() => {
        const res = validate();
        setIsValid(res);
    }, [price]);

    return (
        <Container maxW="container.sm">
            <Flex direction="column" gap={10}>
                <Box>
                <PriceSelector price={price} setPrice={setPrice} isInvalid={!isValid} />
                </Box>
            </Flex>
        </Container>
    );
};

export default StepperPrice;
