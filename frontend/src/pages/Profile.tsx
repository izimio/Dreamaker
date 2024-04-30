import { Box, Container, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { FC } from "react";
import DreamList from "../components/DreamList";
import { useGlobal } from "../providers/global";
import ActionHistory from "../components/ActionHistory";

const Profile: FC = () => {
    const { dreams, user } = useGlobal();

    if (!user) {
        return (
            <Box
                minH={"100vh"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Spinner size="xl" />
            </Box>
        );
    }
    return (
        <Box>
            <Heading
                fontSize="4xl"
                textAlign="center"
                fontWeight={"bold"}
                mt={10}
                bgGradient={"linear(to-bl, light, federalBlue)"}
                bgClip="text"
                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
            >
                {"Hi, "}
                {user?.address.substring(0, 10)}...
                {user?.address.substring(
                    user?.address.length - 4,
                    user?.address.length
                )}
                {
                    <span
                        style={{
                            color: "black",
                        }}
                    >
                        {" "}
                        👋
                    </span>
                }
            </Heading>
            <Box display={"flex"} justifyContent={"center"}>
                <Flex
                    justify="space-between"
                    mt={10}
                    mx={10}
                    gap={10}
                    flexDirection={{
                        base: "column",
                        md: "row",
                    }}
                >
                    <Text
                        bgGradient={"linear(to-bl, light, dark)"}
                        bgClip="text"
                        fontSize="xl"
                        border={"1px solid"}
                        borderColor={"darkcyan"}
                        p={2}
                        borderRadius={"md"}
                    >
                        DMK balance:{" "}
                        <span
                            style={{
                                textDecoration: "underline",
                                color: "darkcyan",
                                fontWeight: "bold",
                            }}
                        >
                            {user?.DMK ? user.DMK : "calculating..."}
                        </span>
                    </Text>
                    <Text
                        bgGradient={"linear(to-bl, light, dark)"}
                        bgClip="text"
                        fontSize="xl"
                        border={"1px solid"}
                        borderColor={"darkcyan"}
                        p={2}
                        borderRadius={"md"}
                    >
                        First connection:{" "}
                        <span
                            style={{
                                textDecoration: "underline",
                                color: "darkcyan",
                                fontWeight: "bold",
                            }}
                        >
                            {user?.creation
                                ? new Date(user.creation).toLocaleDateString()
                                : "calculating..."}
                        </span>
                    </Text>
                </Flex>
            </Box>
            <Container
                my={10}
                maxW={{
                    base: "100%",
                    md: "container.md",
                    xl: "container.xl",
                }}
            >
                <Text
                    bgGradient={"linear(to-bl, light, dark)"}
                    bgClip="text"
                    fontSize="2xl"
                    fontWeight={"bold"}
                >
                    My actions
                </Text>
                <ActionHistory actions={user!.actionHistory} />
            </Container>
            <Container
                maxW={{
                    base: "100%",
                    md: "container.md",
                    xl: "container.xl",
                }}
            >
                <Text
                    bgGradient={"linear(to-bl, light, dark)"}
                    bgClip="text"
                    fontSize="2xl"
                    fontWeight={"bold"}
                >
                    My dreams
                </Text>
                <DreamList
                    dreams={dreams.allDreams.filter(
                        (dream) =>
                            dream.owner.toLowerCase() ===
                            user?.address.toLowerCase()
                    )}
                />
            </Container>
        </Box>
    );
};

export default Profile;
