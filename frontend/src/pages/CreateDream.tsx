import { FC } from "react";
import { Box, Container } from "@chakra-ui/react";
import DreamStepper from "../components/dreamStepper/DreamStepper";

const CreateDream: FC = () => {
    return (
        <Box
            m={10}
            rounded={"lg"}
            bgGradient={
                "linear(to-tr, dark, dark, darkBlue,dark,darkBlue, regular, dark,dark    )"
            }
            p={5}
        >
            <Container maxW="container.lg" h={"100%"} minH={"500px"}>
                <DreamStepper />
            </Container>
        </Box>
    );
};
export default CreateDream;
