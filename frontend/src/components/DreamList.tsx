import { FC } from "react";
import DreamCard from "./DreamCard";
import { Container, Flex } from "@chakra-ui/react";

interface DreamListProps {
    dreams: any[];
}
const DreamList: FC<DreamListProps> = ({ dreams }) => {
    return (
        <Flex justifyContent="space-between" flexWrap="wrap" m={1}>
            {dreams.length > 0 ? (
                dreams.map((dream) => (
                    <DreamCard key={dream._id} dream={dream} />
                ))
            ) : (
                <div>No dreams found</div>
            )}
        </Flex>
    );
};

export default DreamList;
