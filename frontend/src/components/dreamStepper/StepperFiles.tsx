import {
    Box,
    Container,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    Text,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useGlobal } from "../../providers/global";
import toast from "react-hot-toast";
import { ArrowBackIcon, ArrowForwardIcon, CloseIcon } from "@chakra-ui/icons";

interface StepperFilesProps {
    files: any;
    setFiles: (d: any) => void;
    setValideStep: (f: boolean) => void;
}

const blobPreview = (file: any, id: number, onDelete: (id: number) => void) => {
    const blob = new Blob([file], { type: file.type });

    return (
        <Box
            mt={5}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            h={"100px"}
            rounded={"lg"}
            border={id === 0 ? "2px solid gold" : "2px solid transparent"}
            _hover={{
                borderColor: id === 0 ? "gold" : "white",
            }}
            position={"relative"}
        >
            <CloseIcon
                onClick={() => onDelete(id)}
                color={"white"}
                bg={"red.500"}
                rounded={"lg"}
                position={"absolute"}
                top={"-7px"}
                right={"-7px"}
                w="25px"
                h="25px"
                p={1}
                cursor={"pointer"}
                _hover={{
                    bg: "red.600",
                }}
                zIndex={1}
            />
            {file.type.includes("image") ? (
                <img
                    src={URL.createObjectURL(blob)}
                    alt={file.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            ) : (
                <video
                    src={URL.createObjectURL(blob)}
                    controls
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            )}
        </Box>
    );
};

const StepperFiles: FC<StepperFilesProps> = ({
    files,
    setFiles,
    setValideStep,
}) => {
    const { constants } = useGlobal();
    const validate = () => {
        setValideStep(true);
        return true;
    };
    useEffect(() => {
        validate();
    }, [files]);

    console.log("HERE", files);
    return (
        <Container maxW="container.sm">
            <Box>
                <Box>
                    <Text color={"white"} textShadow={" 1px 1px 1px cyan"}>
                        Upload Files (Optional)
                    </Text>
                    <Text
                        mb="8px"
                        fontSize={"sm"}
                        color={"grey"}
                        textShadow={" 1px 1px 1px cyan"}
                    >
                        You can upload up to 5 files.{" "}
                        <span
                            style={{
                                textDecoration: "underline",
                                color: "gold",
                            }}
                        >
                            (The first one will be the cover )
                        </span>
                    </Text>
                    <Box
                        width="100%"
                        __css={{
                            div: {
                                flex: 1,
                                padding: "10px",
                            },
                            flex: 1,
                            minWidth: "100%",
                        }}
                        flex={1}
                    >
                        <FileUploader
                            title="Drag & Drop files here"
                            multiple={true}
                            types={constants.allowedExtensions}
                            handleChange={(f: any) => {
                                const len = f.length;
                                if (files.length + len > 5) {
                                    toast.error(
                                        "You can only upload up to 5 files"
                                    );
                                    return;
                                }
                                const newFiles = Object.values(f).map(
                                    (file: any) => file
                                );
                                setFiles([...files, ...newFiles]);
                            }}
                        />
                    </Box>

                    <Flex flexWrap={"wrap"} gap={2} mt={5} mb={5}>
                        {files.map((file: any, index: number) => (
                            <Box
                                key={index}
                                style={{
                                    width: "30%",
                                    userSelect: "none",
                                }}
                            >
                                {blobPreview(file, index, (id: number) => {
                                    const newFiles = files.filter(
                                        (_: any, i: number) => i !== id
                                    );
                                    setFiles(newFiles);
                                })}
                                <Flex mt={4} justifyContent={"center"} gap={3}>
                                    {index - 1 >= 0 && (
                                        <ArrowBackIcon
                                            color={"white"}
                                            cursor={"pointer"}
                                            bg={"regular"}
                                            fontSize={"2xl"}
                                            rounded={"md"}
                                            _hover={{
                                                bg: "regular-3",
                                            }}
                                            onClick={() => {
                                                const element = files[index];
                                                files[index] = files[index - 1];
                                                files[index - 1] = element;
                                                setFiles([...files]);
                                            }}
                                        />
                                    )}
                                    {index + 1 < files.length && (
                                        <ArrowForwardIcon
                                            color={"white"}
                                            cursor={"pointer"}
                                            bg={"regular"}
                                            fontSize={"2xl"}
                                            rounded={"md"}
                                            _hover={{
                                                bg: "regular-3",
                                            }}
                                            onClick={() => {
                                                const element = files[index];
                                                files[index] = files[index + 1];
                                                files[index + 1] = element;
                                                setFiles([...files]);
                                            }}
                                        />
                                    )}
                                </Flex>
                            </Box>
                        ))}
                    </Flex>
                </Box>
            </Box>
        </Container>
    );
};

export default StepperFiles;
