import {
    Box,
    Container,
    Flex,
    Input,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
import { FC, useEffect } from "react";
import { useGlobal } from "../../providers/global";
import toast from "react-hot-toast";

interface StepperPriceProps {
    price: {
        amount: string;
        currency: string;
    };
    setPrice: (price: { amount: string; currency: string }) => void;
    setValideStep: (f: boolean) => void;
}

const bigNumberRegex = new RegExp("^[0-9]*$");
const ethersFormatRegex = new RegExp("^[0-9]*[.]?[0-9]*$");
const gweiFormatRegex = new RegExp("^[0-9]*[.]?[0-9]*$");

const StepperGeneral: FC<StepperPriceProps> = ({
    price,
    setPrice,
    setValideStep,
}) => {
    const { constants } = useGlobal();

    const validate = () => {
        if (
            !price.amount.length ||
        )
        setValideStep(true);
    };

    useEffect(() => {
        validate();
    }, [name, description, tags]);

    return (
        <Container maxW="container.sm">
            <Flex direction="column" gap={10}>
                <Box>
                    <Text color={"white"} textShadow={" 1px 1px 1px cyan"}>
                        Dream name
                    </Text>
                    <Text
                        mb="8px"
                        fontSize={"sm"}
                        color={"grey"}
                        textShadow={" 1px 1px 1px cyan"}
                    >
                        Minimum: {constants.limits.dreamTitle.min} characters
                    </Text>
                    <Input
                        isInvalid={
                            name.length < constants.limits.dreamTitle.min ||
                            name.length > constants.limits.dreamTitle.max
                        }
                        placeholder="description"
                        maxLength={constants.limits.dreamTitle.max}
                        minLength={constants.limits.dreamTitle.min}
                        focusBorderColor="white"
                        color={"white"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Box>
                <Box rounded="lg">
                    <Text color={"white"} textShadow={" 1px 1px 1px cyan"}>
                        Dream description
                    </Text>
                    <Text
                        mb="8px"
                        fontSize={"sm"}
                        color={"grey"}
                        textShadow={" 1px 1px 1px cyan"}
                    >
                        Minimum: {constants.limits.dreamDescription.min}{" "}
                        characters
                    </Text>
                    <Textarea
                        isInvalid={
                            description.length > 0 &&
                            (description.length <
                                constants.limits.dreamDescription.min ||
                                description.length >
                                    constants.limits.dreamDescription.max)
                        }
                        placeholder="Give a nice description for your dream"
                        maxLength={constants.limits.dreamDescription.max}
                        minLength={constants.limits.dreamDescription.min}
                        focusBorderColor="white"
                        color={"white"}
                        h={"200"}
                        maxH={"200"}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Box>
                <Box>
                    <Text color={"white"} textShadow={" 1px 1px 1px cyan"}>
                        Tags
                    </Text>
                    <Text
                        mb="8px"
                        fontSize={"sm"}
                        color={"grey"}
                        textShadow={" 1px 1px 1px cyan"}
                    >
                        Select at least one tag
                    </Text>
                    <Box
                        __css={{
                            "* > *": {
                                borderColor: "white !important",
                                boxShadow: "none !important",
                                "* > *": {
                                    border: "15 px solid white !important",
                                },
                            },
                        }}
                    >
                        <MultiSelect
                            options={options}
                            placeholder="Select at least on tag for your dream"
                            _focus={{
                                borderColor: "red !important",
                            }}
                            borderColor={"white"}
                            color={"white"}
                            value={value}
                            onChange={(value) => {
                                const rValue =
                                    (value as {
                                        value: string;
                                        label: string;
                                    }[]) || [];

                                if (
                                    rValue.length >
                                    constants.limits.dreamTags.max
                                ) {
                                    toast.dismiss("tags");
                                    toast.error(
                                        "You can only select up to 5 tags",
                                        {
                                            id: "tags",
                                        }
                                    );
                                    return;
                                }

                                setTags(
                                    rValue!.map(
                                        (tag: {
                                            value: string;
                                            label: string;
                                        }) => tag.value
                                    )
                                );
                                onChange(value);
                            }}
                        />
                    </Box>
                </Box>
            </Flex>
        </Container>
    );
};

export default StepperGeneral;
