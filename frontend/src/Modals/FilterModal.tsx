import {
    Box,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    Stack,
    Text,
} from "@chakra-ui/react";
import { IFilters } from "../components/DreamList";
import { FC, useEffect } from "react";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
import { useGlobal } from "../providers/global";
interface FilterModalProps {
    popoverOpen: boolean;
    setPopoverOpen: (value: boolean) => void;
    filters: IFilters;
    setFilters: (value: IFilters) => void;
}

const FilterModal: FC<FilterModalProps> = ({
    popoverOpen,
    setPopoverOpen,
    filters,
    setFilters,
}: FilterModalProps) => {
    const { constants } = useGlobal();
    const { value, options, onChange } = useMultiSelect({
        value: filters.tags || [],
        options: constants.tags.map((tag) => ({ value: tag, label: tag })),
    });

    return (
        <Modal
            isOpen={popoverOpen}
            onClose={() => {
                setPopoverOpen(false);
            }}
            isCentered={true}
        >
            <ModalOverlay />
            <ModalContent minW="500px" pb={4}>
                <ModalCloseButton />

                <ModalHeader
                    textAlign={"center"}
                    bgGradient={"linear(to-bl, light, federalBlue)"}
                    fontSize={"4xl"}
                    fontWeight={"bold"}
                    bgClip="text"
                    textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                    mb={2}
                >
                    Filters Settings{" "}
                </ModalHeader>
                <ModalBody
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Stack direction="column" justify={"left"} spacing={5}>
                        <RadioGroup
                            value={filters.status}
                            onChange={(value) => {
                                setFilters({ ...filters, status: value });
                            }}
                        >
                            <Text
                                bgGradient={"linear(to-bl, light, federalBlue)"}
                                fontSize={"xl"}
                                fontWeight={"bold"}
                                bgClip="text"
                                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                                mb={2}
                            >
                                Status
                            </Text>
                            <Stack
                                direction="row"
                                align="center"
                                justify={"left"}
                                spacing={5}
                                wrap="wrap"
                            >
                                <Radio value="all">All</Radio>
                                <Radio value="pending_validation">
                                    Pending{" "}
                                </Radio>
                                <Radio value="active">Active</Radio>
                                <Radio value="reached">Reached </Radio>
                                <Radio value="expired">Expired </Radio>
                            </Stack>
                        </RadioGroup>
                        <Box>
                            <Text
                                bgGradient={"linear(to-bl, light, federalBlue)"}
                                fontSize={"xl"}
                                fontWeight={"bold"}
                                bgClip="text"
                                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                                mb={2}
                            >
                                Minimum funding amount (in Wei)
                            </Text>
                            <Input
                                type="string"
                                placeholder="Min funding amount"
                                value={filters.minFundingAmount}
                                onChange={(e) => {
                                    if (e.target.value === "") {
                                        setFilters({
                                            ...filters,
                                            minFundingAmount: 1,
                                        });
                                    }
                                    setFilters({
                                        ...filters,
                                        minFundingAmount: Number(
                                            e.target.value
                                        ),
                                    });
                                }}
                            />
                        </Box>
                        <Box>
                            <Text
                                bgGradient={"linear(to-bl, light, federalBlue)"}
                                fontSize={"xl"}
                                fontWeight={"bold"}
                                bgClip="text"
                                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                                mb={2}
                            >
                                Tags
                            </Text>
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

                                    setFilters({
                                        ...filters,
                                        tags: rValue.map((tag) => tag.value),
                                    });
                                    onChange(value);
                                }}
                            />
                        </Box>
                        <Box>
                            <Text
                                bgGradient={"linear(to-bl, light, federalBlue)"}
                                fontSize={"xl"}
                                fontWeight={"bold"}
                                bgClip="text"
                                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                                mb={2}
                            >
                                Favorite
                            </Text>

                            <RadioGroup
                                value={filters.favorite ? "true" : "false"}
                                onChange={(value) => {
                                    setFilters({
                                        ...filters,
                                        favorite: value === "true",
                                    });
                                }}
                            >
                                <Stack
                                    direction="row"
                                    align="center"
                                    justify={"left"}
                                    spacing={5}
                                    wrap="wrap"
                                >
                                    <Radio value={"true"}>Yes</Radio>
                                    <Radio value={"false"}>No</Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default FilterModal;
