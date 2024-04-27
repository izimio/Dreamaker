import {
    Box,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    NumberInput,
    NumberInputField,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { FC } from "react";
import { useEthereum } from "../providers/ethereum";

interface PriceSelectorProps {
    price: {
        amount: string;
        currency: "ETH" | "GWEI" | "WEI";
    };
    setPrice: (price: {
        amount: string;
        currency: "ETH" | "GWEI" | "WEI";
    }) => void;
    isInvalid?: boolean;
    showText?: boolean;
}

const PriceSelector: FC<PriceSelectorProps> = ({
    price,
    setPrice,
    isInvalid,
    showText = true,
}) => {
    const { ethPrice } = useEthereum();
    return (
        <Box>
            {showText && (
                <Text color={"white"} textShadow={" 1px 1px 1px cyan"}>
                    Set the price
                </Text>
            )}
            {showText && (
                <Text
                    mb="8px"
                    fontSize={"sm"}
                    color={"grey"}
                    textShadow={" 1px 1px 1px cyan"}
                >
                    Set the price in {price.currency} for your dream
                </Text>
            )}
            <Flex gap={2} direction={"row"}>
                <NumberInput
                    defaultValue={0}
                    focusBorderColor="white"
                    value={price.amount}
                    onChange={(value) => {
                        if (value === "." || value === "e") {
                            return;
                        }
                        setPrice({ ...price, amount: value.toString() });
                    }}
                    onBlur={() => {
                        const padding =
                            price.currency === "ETH"
                                ? 18
                                : price.currency === "GWEI"
                                  ? 9
                                  : 0;
                        let value = price.amount;
                        if (value === "" || value === ".") {
                            value = "0";
                        }
                        if (price.currency !== "WEI" && value.includes(".")) {
                            const subValue = value.split(".");
                            value =
                                subValue[0] +
                                "." +
                                subValue[1].padEnd(padding, "0");
                        }
                        setPrice({ ...price, amount: value });
                    }}
                    isInvalid={isInvalid}
                    color={"white"}
                    w={"100%"}
                >
                    <NumberInputField />
                </NumberInput>
                <Menu id="currency-menu">
                    <Tooltip
                        label="Select currency"
                        aria-label="Select currency"
                    >
                        <MenuButton
                            style={{
                                backgroundColor: "white",
                                borderRadius: "5px",
                                padding: "5px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            _hover={{
                                opacity: 0.8,
                            }}
                        >
                            <Text
                                style={{
                                    color: "black",
                                    fontWeight: "bold",
                                }}
                            >
                                {price.currency}
                            </Text>
                        </MenuButton>
                    </Tooltip>
                    <MenuList>
                        <MenuItem
                            onClick={() =>
                                setPrice({ amount: "0", currency: "ETH" })
                            }
                        >
                            <Text>ETH</Text>
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                setPrice({ amount: "0", currency: "GWEI" })
                            }
                        >
                            <Text>GWEI</Text>
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                setPrice({ amount: "0", currency: "WEI" })
                            }
                        >
                            <Text>WEI</Text>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
            {showText && (
                <Text
                    fontSize={"sm"}
                    marginTop={"8px"}
                    color={"grey"}
                    textShadow={" 1px 1px 1px cyan"}
                    textAlign={"center"}
                >
                    1 ETH ~ {ethPrice} USDT
                </Text>
            )}
        </Box>
    );
};

export default PriceSelector;
