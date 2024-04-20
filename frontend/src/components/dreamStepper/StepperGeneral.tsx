import {
    Box,
    Container,
    Flex,
    Input,
    Spinner,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
import { FC } from "react";
import { useGlobal } from "../../providers/global";

interface StepperProps {
    name: string;
    description: string;
    tags: string[];
    setName: (name: string) => void;
    setDescription: (description: string) => void;
    setTags: (tags: string[]) => void;
}

const StepperGeneral: FC<StepperProps> = ({
    name,
    description,
    tags,
    setName,
    setDescription,
    setTags,
}) => {
    const { constants } = useGlobal();
    const { value, options, onChange } = useMultiSelect({
        value: tags || [],
        options: constants.tags.map((tag) => ({ value: tag, label: tag })),
    });
    return (
        <Container maxW="container.sm">
            <Flex direction="column" gap={10}>
                <Box>
                    <Text
                        mb="8px"
                        color={"white"}
                        textShadow={" 1px 1px 1px cyan"}
                    >
                        Dream Name
                    </Text>
                    <Input
                        placeholder="description"
                        maxLength={100}
                        focusBorderColor="white"
                        color={"white"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Box>
                <Box rounded="lg">
                    <Text
                        mb="8px"
                        color={"white"}
                        textShadow={" 1px 1px 1px cyan"}
                    >
                        Dream Description
                    </Text>
                    <Textarea
                        placeholder="Give a nice description of your dream"
                        maxLength={500}
                        focusBorderColor="white"
                        color={"white"}
                        h={"200px"}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Box>
                <Box>
                    <Text
                        mb="8px"
                        color={"white"}
                        textShadow={" 1px 1px 1px cyan"}
                    >
                        Tags
                    </Text>
                    <Box __css={{
                        "* > *" : {
                            borderColor: "white !important",
                            boxShadow: "none !important",
                            "* > *" : {
                                border: "15 px solid white !important",
                            },
                        }
                    }}>
                        <MultiSelect
                            options={options}
                            placeholder="Select tags"
                            _focus={{
                                borderColor: "white !important",
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
