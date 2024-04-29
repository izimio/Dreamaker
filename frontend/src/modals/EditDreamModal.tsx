import {
    Box,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
import { useGlobal } from "../providers/global";
import { updateDream } from "../api/dream";
import toast from "react-hot-toast";
interface EditModalProps {
    id: string;
    isOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    prevValues: {
        title: string;
        description: string;
        tags: string[];
    };
}

const EditDreamModal: FC<EditModalProps> = ({
    id,
    isOpen,
    setIsModalOpen,
    prevValues,
}: EditModalProps) => {
    const [title, setTitle] = useState(prevValues.title);
    const [description, setDescription] = useState(prevValues.description);
    const [tags, setTags] = useState(prevValues.tags);
    const [isValideInputs, setIsValideInputs] = useState(false);

    const { dreams, setDreams } = useGlobal();

    useEffect(() => {
        setTitle(prevValues.title);
        setDescription(prevValues.description);
        setTags(prevValues.tags);
    }, [prevValues]);

    const { constants } = useGlobal();
    const { value, options, onChange } = useMultiSelect({
        value: tags || [],
        options: constants.tags.map((tag) => ({ value: tag, label: tag })),
    });

    const validate = () => {
        if (
            title.length < constants.limits.dreamTitle.min ||
            title.length > constants.limits.dreamTitle.max
        ) {
            setIsValideInputs(false);
            return;
        }

        if (
            description.length < constants.limits.dreamDescription.min ||
            description.length > constants.limits.dreamDescription.max
        ) {
            setIsValideInputs(false);
            return;
        }

        if (
            tags.length > constants.limits.dreamTags.max ||
            tags.length < constants.limits.dreamTags.min
        ) {
            setIsValideInputs(false);
            return;
        }

        setIsValideInputs(true);
    };

    const handleUpdate = async () => {
        if (!isValideInputs) {
            return;
        }
        const res = await updateDream(id, title, description, tags);

        if (!res.ok) {
            toast.error(res.data);
            return;
        }
        const dreamIdx = dreams.allDreams.findIndex((dr) => dr._id === id);
        dreams.allDreams[dreamIdx].title = title;
        dreams.allDreams[dreamIdx].description = description;
        dreams.allDreams[dreamIdx].tags = tags;

        setDreams(dreams);
        toast.success("Dream Updated!");
    };

    useEffect(() => {
        validate();
    }, [title, description, tags]);

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
                        <Box>
                            <Text
                                bgGradient={"linear(to-bl, light, federalBlue)"}
                                fontSize={"md"}
                                fontWeight={"bold"}
                                bgClip="text"
                                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                                mb={2}
                            >
                                Title
                            </Text>

                            <Input
                                placeholder="Update Title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                                maxLength={constants.limits.dreamTitle.max}
                                minLength={constants.limits.dreamTitle.min}
                                isInvalid={
                                    title.length > 0 &&
                                    (title.length <
                                        constants.limits.dreamTitle.min ||
                                        title.length >
                                            constants.limits.dreamTitle.max)
                                }
                            />
                        </Box>
                        <Box>
                            <Text
                                bgGradient={"linear(to-bl, light, federalBlue)"}
                                fontSize={"md"}
                                fontWeight={"bold"}
                                bgClip="text"
                                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                                mb={2}
                            >
                                Description
                            </Text>
                            <Textarea
                                placeholder="Update Description"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                maxLength={
                                    constants.limits.dreamDescription.max
                                }
                                h={"200"}
                                maxH={"200"}
                                minLength={
                                    constants.limits.dreamDescription.min
                                }
                                isInvalid={
                                    description.length > 0 &&
                                    (description.length <
                                        constants.limits.dreamDescription.min ||
                                        description.length >
                                            constants.limits.dreamDescription
                                                .max)
                                }
                            />
                        </Box>
                        <Box>
                            <Text
                                bgGradient={"linear(to-bl, light, federalBlue)"}
                                fontSize={"md"}
                                fontWeight={"bold"}
                                bgClip="text"
                                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                                mb={2}
                            >
                                Tags
                            </Text>
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
                                    if (
                                        rValue.length >
                                        constants.limits.dreamTags.max
                                    ) {
                                        return;
                                    }
                                    setTags(rValue.map((tag) => tag.value));
                                    onChange(value);
                                }}
                            />
                        </Box>
                        <Box
                            m={"auto"}
                            w={"20%"}
                            textAlign={"center"}
                            cursor={isValideInputs ? "pointer" : "not-allowed"}
                            borderRadius={"md"}
                            opacity={isValideInputs ? 1 : 0.5}
                            transition={"all 0.3s"}
                            color={"white"}
                            bg={"regular"}
                            _hover={{
                                bg: "regular+2",
                            }}
                            p={2}
                            onClick={() => {
                                handleUpdate();
                            }}
                        >
                            Update
                        </Box>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditDreamModal;
