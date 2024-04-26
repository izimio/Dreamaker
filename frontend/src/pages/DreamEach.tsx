import { Box, Center, Container, Flex } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { DREAMS } from "../constants/routes";
import { useNavigate, useParams } from "react-router-dom";
import { IDream, useGlobal } from "../providers/global";
import InfosAside from "../components/Each/InfosAside";
import AssetsBox from "../components/Each/AssetsBox";
import Graph from "../components/Each/Graph";
import FundersList from "../components/Each/FundersList";

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
            <Container maxW={"container.3xl"} h={"100%"}>
                <Flex
                    h={{
                        base: "100%",
                        lg: "750px",
                    }}
                    gap={"2em"}
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
                <Flex
                    h={{
                        base: "100%",
                        lg: "500px",
                    }}
                    w={"100%"}
                    mt={"2em"}
                    gap={"2em"}
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
                    <Box
                        flex={{
                            base: 1,
                            lg: 7,
                        }}
                        width={"100%"}
                    >
                        <Graph graph={refDream!.fundingGraph} />
                    </Box>
                    <Box
                        flex={{
                            base: 1,
                            lg: 3,
                        }}
                        width={{
                            base: "100%",
                            lg: "auto",
                        }}
                    >
                        <FundersList funders={refDream!.funders} />
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default Dream;
