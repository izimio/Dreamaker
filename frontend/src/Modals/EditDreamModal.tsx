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
import { FC, useEffect, useState } from "react";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
import { useGlobal } from "../providers/global";
interface EditModalProps {
    isOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    prevValues: {
        title: string;
        description: string;
        tags: string[];
    };
}

const EditDreamModal: FC<EditModalProps> = ({
    isOpen,
    setIsModalOpen,
    prevValues,
}: EditModalProps) => {
    const [title, setTitle] = useState(prevValues.title);
    const [description, setDescription] = useState(prevValues.description);
    const [tags, setTags] = useState(prevValues.tags);

    const { constants } = useGlobal();
    const { value, options, onChange } = useMultiSelect({
        value: tags || [],
        options: constants.tags.map((tag) => ({ value: tag, label: tag })),
    });
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                setIsModalOpen(false);
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
                    Dream Settings{" "}
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
                        <MultiSelect
                            options={options}
                            placeholder="Update Tags"
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
                                setTags(rValue.map((tag) => tag.value));
                                onChange(value);
                            }}
                        />
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditDreamModal;
