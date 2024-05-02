import {
    Box,
    Container,
    Heading,
    Spinner,
    Table,
    TableContainer,
    Thead,
    Tr,
    Th,
    Tbody,
    Tooltip,
    Text,
    Icon,
    Button,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { IDreamStatus, useGlobal } from "../providers/global";
import { useNavigate } from "react-router-dom";
import { HOME } from "../constants/routes";
import { ethers } from "ethers";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { getProxyFactoryBalance } from "../api/tools";
import WithdrawFactoryModal from "../modals/withdrawFactoryModal";

const AdminPanel: FC = () => {
    const { user, dreams } = useGlobal();
    const [status, setStatus] = useState("all");
    const [proxyBalance, setProxyBalance] = useState("calculating...");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const allDreams = dreams.allDreams;

    const filteredDreams =
        status !== "all"
            ? allDreams.filter((dream) => dream.status === status)
            : allDreams;

    useEffect(() => {
        if (!user) {
            return;
        }
        if (!user.isAdmin) {
            navigate(HOME);
        }

        const retrieveProxyBalance = async () => {
            const res = await getProxyFactoryBalance();
            if (res.ok) {
                setProxyBalance(ethers.formatEther(res.data.balance));
            } else {
                setProxyBalance("error fetching balance");
            }
        };
        retrieveProxyBalance();
    }, [user, navigate, isModalOpen]);

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
        <Container
            my={10}
            maxW={{
                base: "100%",
                md: "container.md",
                xl: "container.xl",
            }}
        >
            <WithdrawFactoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                maxBalance={proxyBalance}
            />
            <Heading
                fontSize="4xl"
                textAlign="center"
                fontWeight={"bold"}
                mt={10}
                bgGradient={"linear(to-bl, light, federalBlue)"}
                bgClip="text"
                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
            >
                Dreamaker Admin Panel
            </Heading>
            <Text
                bgGradient={"linear(to-bl, light, dark)"}
                bgClip="text"
                fontSize="2xl"
                fontWeight={"bold"}
                mt={10}
            >
                Overview
            </Text>
            <TableContainer>
                <Table variant="striped" colorScheme="gray" width={"100%"}>
                    <Thead>
                        <Tr>
                            <Th fontSize={"md"}>Status</Th>
                            <Th fontSize={"md"}>Total</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr
                            _hover={{
                                background: "rgba(140, 140, 140, 0.1)",
                            }}
                            onClick={() => setStatus("all")}
                        >
                            <Th>All</Th>
                            <Th>{allDreams.length}</Th>
                        </Tr>
                        {Object.values(IDreamStatus).map((status, index) => (
                            <Tr
                                key={index}
                                _hover={{
                                    background: "rgba(140, 140, 140, 0.1)",
                                }}
                                onClick={() => setStatus(status)}
                            >
                                <Th>{status}</Th>
                                <Th>
                                    {
                                        allDreams.filter(
                                            (dream) => dream.status === status
                                        ).length
                                    }
                                </Th>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            {status && (
                <>
                    <Text
                        bgGradient={"linear(to-bl, light, dark)"}
                        bgClip="text"
                        fontSize="2xl"
                        fontWeight={"bold"}
                        mt={10}
                    >
                        {status} dreams
                    </Text>
                    <Box
                        style={{
                            height: "3px",
                            borderRadius: "full",
                            width: "100%",
                        }}
                        bgGradient={{
                            base: "linear(to-r, cyan.400, blue.500, purple.600)",
                            md: "linear(to-r, cyan.400, blue.500, purple.600)",
                        }}
                    />
                    <TableContainer>
                        <Table
                            variant="striped"
                            colorScheme="gray"
                            width={"100%"}
                        >
                            <Thead>
                                <Tr>
                                    <Th fontSize={"md"}>Id</Th>
                                    <Th fontSize={"md"}>Owner</Th>
                                    <Th fontSize={"md"}>Target</Th>
                                    <Th fontSize={"md"}>Current</Th>
                                    <Th fontSize={"md"}>Proxy</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredDreams.map((dream, index) => (
                                    <Tr
                                        key={index}
                                        _hover={{
                                            background:
                                                "rgba(140, 140, 140, 0.1)",
                                        }}
                                    >
                                        <Tooltip
                                            label="View Dream"
                                            openDelay={500}
                                        >
                                            <Th
                                                cursor={"pointer"}
                                                onClick={() =>
                                                    navigate(
                                                        `/dream/${dream._id}`
                                                    )
                                                }
                                            >
                                                {"..."}
                                                {dream._id.slice(-6)}{" "}
                                                <Icon
                                                    as={NorthEastIcon}
                                                    w={5}
                                                    h={5}
                                                    color={"darkcyan"}
                                                />
                                            </Th>
                                        </Tooltip>
                                        <Tooltip
                                            label={dream.owner}
                                            openDelay={500}
                                        >
                                            <Th>
                                                {dream.owner.substring(0, 6) +
                                                    "..." +
                                                    dream.owner.substring(
                                                        dream.owner.length - 4
                                                    )}
                                            </Th>
                                        </Tooltip>
                                        <Tooltip
                                            label={dream.targetAmount}
                                            openDelay={500}
                                        >
                                            <Th>
                                                {ethers.formatEther(
                                                    dream.targetAmount
                                                )}
                                            </Th>
                                        </Tooltip>
                                        <Tooltip
                                            label={dream.currentAmount}
                                            openDelay={500}
                                        >
                                            <Th>
                                                {ethers.formatEther(
                                                    dream.currentAmount
                                                )}
                                            </Th>
                                        </Tooltip>
                                        <Tooltip
                                            label={dream.proxyAddress}
                                            openDelay={500}
                                        >
                                            <Th>
                                                {dream.proxyAddress
                                                    ? dream.proxyAddress.substring(
                                                          0,
                                                          6
                                                      ) +
                                                      "..." +
                                                      dream.proxyAddress.substring(
                                                          dream.proxyAddress
                                                              .length - 4
                                                      )
                                                    : "None"}
                                            </Th>
                                        </Tooltip>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </>
            )}
            <Box
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
                mt={10}
                backgroundColor={"#f5f5f5"}
                p={5}
                borderRadius={10}
            >
                <Text
                    bgGradient={"linear(to-bl, light, dark)"}
                    bgClip="text"
                    fontSize="2xl"
                    fontWeight={"bold"}
                >
                    Proxy Factory Balance:
                </Text>
                <Text
                    bgGradient={"linear(to-bl, light, dark)"}
                    bgClip="text"
                    fontSize="4xl"
                    fontWeight={"bold"}
                    mt={5}
                >
                    {proxyBalance} ETH
                </Text>
                <Button
                    mt={5}
                    bgGradient={"linear(to-r, cyan.400, blue.500, purple.600)"}
                    color={"white"}
                    _hover={{
                        bgGradient:
                            "linear(to-r, cyan.400, blue.400, purple.500)",
                        color: "white",
                    }}
                    onClick={() => setIsModalOpen(true)}
                >
                    Withdraw Balance 💎
                </Button>
            </Box>
        </Container>
    );
};

export default AdminPanel;
