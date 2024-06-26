import { FC } from "react";
import { Box, Container, Heading } from "@chakra-ui/react";
import HomeHero from "../components/HomeHero";
import bg from "/bg.png";
import DreamButton from "../components/DreamButton";
import { useGlobal } from "../providers/global";

const Home: FC = () => {
    const { user } = useGlobal();
    return (
        <Box
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundRepeat: "repeat",
                backgroundPosition: "center",
                backgroundPositionX: "start",
                backgroundPositionY: "revert",
                marginBottom: "8.8em",
            }}
            zIndex={1}
        >
            <Heading
                fontSize="8xl"
                textAlign="center"
                fontWeight={"bold"}
                mt={10}
                bgGradient={"linear(to-bl, light, federalBlue)"}
                bgClip="text"
                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
            >
                Dreamaker
            </Heading>
            <Box mt={10} maxW="100%">
                <HomeHero />
            </Box>
            <Box mt={10}>
                <Container
                    maxW={{
                        base: "container.sm",
                        lg: "25%",
                    }}
                >
                    <DreamButton disabled={!user?.address} />
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
