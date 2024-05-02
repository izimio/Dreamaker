import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";

interface StatBoxProps {
    title: string;
    value: string;
    color: string;
}

const StatBox: FC<StatBoxProps> = ({ title, value, color }) => {
    return (
        <Box
            bg={color}
            p={4}
            borderRadius={8}
            textAlign="center"
            color="white"
            height="100%"
            width="100%"
        >
            <Text
                fontSize="xl"
                fontWeight="bold"
                bgGradient={`
                linear(to-br, ${color}, federalBlue)`}
                bgClip="text"
            >
                {title}
            </Text>
            <Text fontSize="xl" fontWeight="bold">
                {value}
            </Text>
        </Box>
    );
};

export default StatBox;
