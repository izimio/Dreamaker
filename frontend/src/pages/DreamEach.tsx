import { Box, Container, Flex } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { DREAMS } from "../constants/routes";
import { useNavigate, useParams } from "react-router-dom";
import { IDream, useGlobal } from "../providers/global";
import InfosAside from "../components/Each/InfosAside";
import AssetsBox from "../components/Each/AssetsBox";

const Dream: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { dreams } = useGlobal();
    const refDream = dreams.allDreams.find((dream: IDream) => dream._id === id);

    useEffect(() => {
        if (!id || !refDream) {
            navigate(DREAMS);
        }
    }, [id, refDream, navigate]);

    return (
        <Box w={"100%"} p={4}>
            <Container maxW={"container.4xl"}>
                <Flex
                    h={"100%"}
                    gap={"5em"}
                    flexDirection={{
                        base: "column",
                        lg: "row",
                    }}
                    justifyContent={"center"}
                    alignItems={{
                        base: "center",
                        lg: "initial",
                    }}
                >
                    <AssetsBox assets={refDream!.assets} />
                    <InfosAside dream={refDream!} />
                </Flex>
                <Box
                    style={{
                        height: "3px",
                        borderRadius: "full",
                        width: "50%",
                        margin: "auto",
                        marginTop: "2em",
                    }}
                    bgGradient={{
                        base: "linear(to-r, cyan.400, blue.500, purple.600)",
                        md: "linear(to-r, cyan.400, blue.500, purple.600)",
                    }}
                />
            </Container>
        </Box>
    );
};

export default Dream;
