import {
    Box,
    Table,
    TableContainer,
    Thead,
    Tr,
    Th,
    Tbody,
    Tooltip,
    Icon,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { FC } from "react";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Link } from "react-router-dom";

interface ActionHistoryProps {
    actions: {
        dreamId: string;
        action: string;
        amount: string;
        date: string;
    }[];
}
const ActionToEmojis: { [key: string]: string } = {
    CREATE: "🌱",
    FUND: "🎁",
    REFUND: "💸",
    BOOST: "🚀",
};

const ActionHistory: FC<ActionHistoryProps> = ({ actions }) => {
    const sortedActions = actions.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <TableContainer
            width={"100%"}
            maxH={"300px"}
            style={{ overflowY: "scroll", height: "100%" }}
            css={{
                "&::-webkit-scrollbar": {
                    width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                    width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "darkcyan",
                    borderRadius: "24px",
                },
            }}
        >
            <Table variant="striped" colorScheme="gray" width={"100%"}>
                <Thead>
                    <Tr>
                        <Th>Dream</Th>
                        <Th>Date</Th>
                        <Th>Action</Th>
                        <Th>Amount</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedActions.map((action, index) => (
                        <Tr
                            key={index}
                            _hover={{
                                background: "rgba(140, 140, 140, 0.1)",
                                "*": {
                                    color: "darkcyan",
                                },
                            }}
                        >
                            <Th
                                display={"flex"}
                                alignItems={"center"}
                                _hover={{
                                    color: "darkcyan",
                                }}
                            >
                                <Tooltip label="View Dream" openDelay={500}>
                                    <Link to={`/dream/${action.dreamId}`}>
                                        <Box cursor={"pointer"}>
                                            {action.dreamId}{" "}
                                            <Icon
                                                as={NorthEastIcon}
                                                w={5}
                                                h={5}
                                                color={"darkcyan"}
                                            />
                                        </Box>
                                    </Link>
                                </Tooltip>
                            </Th>
                            <Th>
                                {new Date(action.date).toLocaleDateString()}
                            </Th>
                            <Th>
                                {action.action} {ActionToEmojis[action.action]}
                            </Th>
                            <Tooltip
                                label={action.amount + " WEI"}
                                aria-label="A tooltip"
                            >
                                <Th>
                                    {action.amount !== "None"
                                        ? ethers.formatEther(action.amount) +
                                          " " +
                                          (action.action === "BOOST"
                                              ? "DMK"
                                              : "ETH")
                                        : "None"}
                                </Th>
                            </Tooltip>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default ActionHistory;
