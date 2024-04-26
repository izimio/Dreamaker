import { FC } from "react";
import {
    Box,
    Center,
    Tooltip,
    Table,
    TableContainer,
    Tbody,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { ethers } from "ethers";

interface FundersListProps {
    funders: {
        amount: string;
        address: string;
    }[];
}

const FundersList: FC<FundersListProps> = ({ funders }) => {
    const listFunders = funders.sort((a, b) => {
        return Number(b.amount) - Number(a.amount);
    });

    if (listFunders.length === 0) {
        return (
            <Center
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                No funders yet
            </Center>
        );
    }
    return (
        <TableContainer
            width={"100%"}
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
                        <Th>Funder</Th>
                        <Th>Amount</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {listFunders.map((funder, index) => (
                        <Tr key={index}>
                            <Tooltip
                                label={funder.address}
                                aria-label="A tooltip"
                            >
                                <Th>
                                    {funder.address.substring(0, 10)}...
                                    {funder.address.substring(
                                        funder.address.length - 4,
                                        funder.address.length
                                    )}
                                </Th>
                            </Tooltip>
                            <Tooltip
                                label={funder.amount + " WEI"}
                                aria-label="A tooltip"
                            >
                                <Th>{ethers.formatEther(funder.amount)} ETH</Th>
                            </Tooltip>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default FundersList;
