import { Box, Flex, Text } from "@chakra-ui/react";
import DreamakerLogo from "/logo.png";
import Connect from "./Connect";

import { FC } from "react";
const Upbar: FC = () => {
    return (
        <Box  color="white" py={4} width={"100vw"} px={4} bgGradient={"linear(to-l, light, darkBlue, dark)"}>
            <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Box>
                    <Flex minWidth="max-content" alignItems="center" gap="2">
                        <img
                            src={DreamakerLogo}
                            alt="Dreamaker"
                            style={{
                                height: "60px",
                                width: "auto",
                            }}
                        />
                        <Box>
                            <Text fontSize="xl" fontWeight="bold">
                                Dreamaker
                            </Text>
                            <Text fontSize="sm">
                                We are Dream Makers
                            </Text>
                        </Box>
                    </Flex>
                </Box>
                <Box>
                    <Connect />
                </Box>
            </Flex>
        </Box>
    );
};

export default Upbar;
