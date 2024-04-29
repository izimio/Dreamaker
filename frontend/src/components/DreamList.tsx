import { FC, useState } from "react";
import DreamCard from "./DreamCard";
import { Box, Center, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import FilterModal from "../modals/FilterModal";
import { useGlobal } from "../providers/global";

interface DreamListProps {
    dreams: any[];
}

export type IFilters = {
    status: string;
    tags: string[];
    minFundingAmount: number;
    favorite: boolean;
    reached: boolean;
    contains: string;
};

const DreamList: FC<DreamListProps> = ({ dreams }) => {
    const { user } = useGlobal();
    const [filters, setFilters] = useState<IFilters>({
        status: "all",
        tags: [],
        minFundingAmount: 1,
        favorite: false,
        reached: false,
        contains: "",
    });
    const [popoverOpen, setPopoverOpen] = useState(false);

    const filteredDreams = dreams.filter((dream) => {
        if (
            filters.contains &&
            !dream.title.toLowerCase().includes(filters.contains.toLowerCase())
        ) {
            return false;
        }
        if (filters.status !== "all" && dream.status !== filters.status) {
            return false;
        }
        if (filters.tags.length) {
            if (!dream.tags.some((tag: string) => filters.tags.includes(tag))) {
                return false;
            }
        }
        if (dream.minFundingAmount > filters.minFundingAmount) {
            return false;
        }
        if (filters.favorite) {
            if (!dream.likers.includes(user?.address)) {
                return false;
            }
        }
        return true;
    });
    return (
        <>
            <FilterModal
                popoverOpen={popoverOpen}
                setPopoverOpen={setPopoverOpen}
                filters={filters}
                setFilters={setFilters}
            />

            <Box m={1}>
                <Flex
                    justifyContent={"space-between"}
                    m={2}
                    gap={2}
                    h="40px"
                    mb={5}
                >
                    <Input
                        h="100%"
                        placeholder="What are you dreaming of..."
                        focusBorderColor="regular"
                        bg="white"
                        borderRadius="sm"
                        border="2px solid darkcyan"
                        onChange={(e) =>
                            setFilters({ ...filters, contains: e.target.value })
                        }
                        boxShadow="0 0 3px 4px rgba(0, 139, 139, 0.4)"
                    />

                    <Box
                        h="100%"
                        w="40px"
                        bg="regular"
                        cursor="pointer"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _hover={{
                            bg: "darkcyan",
                            "& > svg": {
                                animation: "spin 3s linear infinite",
                            },
                        }}
                        onClick={() => setPopoverOpen(true)}
                    >
                        <SettingsIcon w="50%" h={"100%"} color={"white"} />
                    </Box>
                </Flex>
                <Text
                    fontSize="sm"
                    textAlign="center"
                    my={2}
                    textDecoration="underline"
                >
                    {filteredDreams.length} dreams found
                </Text>
                <Box
                    maxH="1000px"
                    minH={"1000px"}
                    overflowY="auto"
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
                    {filteredDreams.length > 0 ? (
                        <Flex
                            flexWrap="wrap"
                            justifyContent={"flex-start"}
                            gap={"2em"}
                            mt={10}
                        >
                            {filteredDreams.map((dream) => (
                                <DreamCard key={dream._id} dream={dream} />
                            ))}
                        </Flex>
                    ) : (
                        <Center>
                            <Heading
                                fontSize="2xl"
                                fontWeight="bold"
                                textAlign="center"
                                textShadow="1px 1px 1px cyan"
                                mt={5}
                            >
                                ¯\_(ツ)_/¯ Nothing to show here ¯\_(ツ)_/¯
                            </Heading>
                        </Center>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default DreamList;
