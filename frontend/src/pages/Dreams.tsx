import { Box, Container } from "@chakra-ui/react";
import { FC } from "react";
import DreamList from "../components/DreamList";
import { useGlobal } from "../providers/global";
import bg from "/bg.png";

const Dreams: FC = () => {
    const { dreams } = useGlobal();
    console.log(dreams);
    return (
        <Box
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "contain",
                backgroundRepeat: "repeat",
                backgroundPosition: "center",
            }}
        >
            <Container maxW="container.xl">
                <DreamList dreams={dreams} />
            </Container>
        </Box>
    );
};

export default Dreams;
