import { useEthereum } from "../providers/ethereum";
import { useGlobal } from "../providers/global";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { useModals } from "../providers/modals";

const Loading = ({ children }: any) => {
    const { constants } = useGlobal();
    const { ethPrice } = useEthereum();
    const { switchChainModal, switchPictureModal } = useModals();

    const loaders = {
        one: constants.tags.length === 0,
        two: !ethPrice,
        three: !switchChainModal,
        four: !switchPictureModal,
    };
    if (Object.values(loaders).some((loader) => loader)) {
        return (
            <Box
                h="70vh"
                color="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
            >
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="darkBlue"
                    color="regular"
                    size="xl"
                />
                <Text color={"darkBlue"} mt={5}>
                    Loading...
                </Text>
            </Box>
        );
    }
    return children;
};

export default Loading;
