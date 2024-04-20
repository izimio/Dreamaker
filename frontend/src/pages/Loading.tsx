import { useGlobal } from "../providers/global";
import { Box, Spinner, Text } from "@chakra-ui/react";

const Loading = ({ children }: any) => {
    const { constants } = useGlobal();

    if (constants.tags.length === 0) {
        return (
            <Box h="70vh"  color="white" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="darkBlue"
                    color="regular"
                    size="xl"
                />
                <Text color={"darkBlue"} mt={5}>Loading...</Text>
            </Box>
        );
    }
    return children;
};

export default Loading;
