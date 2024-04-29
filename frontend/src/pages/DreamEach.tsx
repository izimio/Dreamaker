import {
    Box,
    Center,
    Container,
    Flex,
    Progress,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { DREAMS } from "../constants/routes";
import { useNavigate, useParams } from "react-router-dom";
import { IDream, useGlobal } from "../providers/global";
import InfosAside from "../components/Each/InfosAside";
import AssetsBox from "../components/Each/AssetsBox";
import Graph from "../components/Each/Graph";
import FundersList from "../components/Each/FundersList";
import InteractionButtons from "../components/Each/InteractionButtons";

const StatusToColord: {
    [key: string]: string;
} = {
    active: "green",
    reached: "blue",
    expired: "red",
    withdrawn: "yellow",
};

const Dream: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [percentFunded, setPercentFunded] = useState(0);
    const { dreams } = useGlobal();
    const refDream = dreams.allDreams.find((dream: IDream) => dream._id === id);

    useEffect(() => {
        if (!id || !refDream) {
            navigate(DREAMS);
            return;
        }
        const percent =
            (BigInt(refDream!.currentAmount) * BigInt(100)) /
            BigInt(refDream!.targetAmount);
        setPercentFunded(Number(percent));
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
                <Center mt={"2em"} flexDirection={"column"} gap={"1em"}>
                    {percentFunded >= 0 ? (
                        <>
                            <Text>{percentFunded}% funded</Text>
                            <Tooltip
                                label={`${percentFunded}%`}
                                aria-label="A tooltip"
                            >
                                <Progress
                                    value={percentFunded}
                                    borderRadius={"full"}
                                    colorScheme={
                                        StatusToColord[refDream!.status]
                                    }
                                    hasStripe
                                    max={100}
                                    w={"70%"}
                                    isAnimated={refDream!.status === "active"}
                                />
                            </Tooltip>
                        </>
                    ) : (
                        <Text>Calculating dream's funding progress...</Text>
                    )}
                </Center>

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
                        <Graph
                            graph={[
                                {
                                    date: refDream!.createdAt,
                                    amount: "0",
                                    funder: "Starting Point",
                                },
                                ...refDream!.fundingGraph,
                            ]}
                        />
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
                        display={"flex"}
                        flexDirection={"column"}
                        gap={"1em"}
                        justifyContent={"space-between"}
                        border={"1px solid"}
                        borderColor={"regular"}
                        rounded={"md"}
                    >
                        <Box height={{ base: "100%", lg: "70%" }}>
                            <FundersList
                                funders={refDream!.funders}
                                status={refDream!.status}
                            />
                        </Box>
                        <Box height={{ base: "100%", lg: "30%" }} p={4}>
                            <InteractionButtons dream={refDream!} />
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default Dream;
