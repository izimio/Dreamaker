import { Box, Flex, Text } from "@chakra-ui/react";

interface IconButtonProps {
    icon: JSX.Element;
    text: string;
    onClick: () => void;
    disable: boolean;
    reverse?: boolean;
}
const IconButton = ({
    icon,
    text,
    onClick,
    disable,
    reverse,
}: IconButtonProps) => {
    return (
        <Box>
            <Flex
                onClick={() => {
                    onClick();
                }}
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                rounded={"sm"}
                p={1}
                flexDir={reverse ? "row-reverse" : "row"}
                color={"white"}
                gap={2}
                transition={"all 0.3s"}
                borderBottom={"2px solid transparent"}
                _hover={{
                    borderColor: disable ? "transparent" : "white",
                    cursor: disable ? "not-allowed" : "pointer",
                }}
                opacity={disable ? 0.5 : 1}
            >
                <Text
                    fontSize="lg"
                    fontWeight="bold"
                    textShadow="1px 1px 1px cyan"
                    userSelect={"none"}
                >
                    {text}
                </Text>
                {icon}
            </Flex>
        </Box>
    );
};

export default IconButton;
