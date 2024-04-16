import { FC } from "react";
import { Box, Container } from "@chakra-ui/react";
import Upbar from "../components/Upbar";

const Home: FC = () => {
    return (
        <Box>
            <Upbar />
            <Container>
                <Box>
                    <h1>Home</h1>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;
