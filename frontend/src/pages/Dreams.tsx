import { Box, Container, Divider, Stack } from "@chakra-ui/react";
import { FC } from "react";
import DreamList from "../components/DreamList";
import { useGlobal } from "../providers/global";
import Carousel from "../components/Carousel";

import bg from "/bg.png";
import DreamButton from "../components/DreamButton";
const Dreams: FC = () => {
    const { dreams } = useGlobal();
    const { user } = useGlobal();
    return (
        <Box
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "contain",
                backgroundRepeat: "repeat",
                backgroundPosition: "center",
            }}
            mb={"8em"}
            mt={"4em"}
        >
            <Container
                maxW={{
                    base: "100%",
                    md: "container.md",
                    xl: "container.xl",
                }}
            >
                <Stack spacing={"5em"}>
                    <Carousel cards={dreams.boostedDreams} type="boost" />
                    <Box
                        style={{
                            height: "5px",
                            borderRadius: "full",
                            width: "50%",
                            margin: "auto",
                        }}
                        bgGradient={{
                            base: "linear(to-r, cyan.400, blue.500, purple.600)",
                            md: "linear(to-r, cyan.400, blue.500, purple.600)",
                        }}
                    />
                    <DreamList dreams={dreams.allDreams} />
                    <Box
                        style={{
                            height: "5px",
                            borderRadius: "full",
                            width: "50%",
                            margin: "auto",
                        }}
                        bgGradient={{
                            base: "linear(to-r, cyan.400, blue.500, purple.600)",
                            md: "linear(to-r, cyan.400, blue.500, purple.600)",
                        }}
                    />
                    <Carousel cards={dreams.hotDreams} type="hot" />
                    <Container maxW="container.md">
                        <DreamButton disabled={!user} />
                    </Container>
                </Stack>
            </Container>
        </Box>
    );
};

export default Dreams;
