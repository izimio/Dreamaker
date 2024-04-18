import { FC } from "react";
import { Box, Container, Heading, Text } from "@chakra-ui/react";
import HomeHero from "../components/HomeHero";
import bg from "/bg.png"

const Home: FC = () => {
    return (
        <Box  style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundPositionX: "start",
            backgroundPositionY: "revert",
        }}>
            <Heading
                fontSize="8xl"
                textAlign="center"
                fontWeight={"bold"}
                mt={10}
                bgGradient={"linear(to-bl, light, federalBlue)"}
                bgClip="text"
                textShadow="3px 3px 0px rgba(0,0,0,0.2)"
            >
                Dreamaker
            </Heading>
            <Box mt={10} maxW="100%">
                <HomeHero />
            </Box>
        </Box>
    );
};

export default Home;
