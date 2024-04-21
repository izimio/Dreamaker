import { FC } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import DreamakerLogo from "/logo.png";
import Connect from "./Connect";
import * as ROUTES from "../constants/routes";

const Upbar: FC = () => {
    return (
        <Box
            color="white"
            py={4}
            px={4}
            pr={8}
            bgGradient={"linear(to-l, light, darkBlue, dark)"}
        >
            <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Box>
                    <Link to={ROUTES.HOME}>
                        <Flex
                            minWidth="max-content"
                            alignItems="center"
                            gap="2"
                            cursor={"pointer"}
                        >
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
                                <Text fontSize="sm">We are Dream Makers</Text>
                            </Box>
                        </Flex>
                    </Link>
                </Box>
                <Box>
                    <Connect />
                </Box>
            </Flex>
        </Box>
    );
};

export default Upbar;
