import { Box, Container, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import toast from "react-hot-toast";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface StepperDateProps {
    date: Date;
    setDate: (d: Date) => void;
    setValideStep: (f: boolean) => void;
}

const StepperDate: FC<StepperDateProps> = ({
    date,
    setDate,
    setValideStep,
}) => {
    const validate = () => {
        if (!date) {
            setValideStep(false);
            return false;
        }
        if (date < new Date()) {
            setValideStep(false);
            return false;
        }
        setValideStep(true);
        return true;
    };

    useEffect(() => {
        validate();
    }, [date]);

    console.log(date.toString());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    console.log(formattedDate);
    return (
        <Container maxW="container.sm">
            <Box>
                <Box mt={4} padding={4}>
                    <Text color={"white"} textShadow={" 1px 1px 1px cyan"}>
                        Ending Date
                    </Text>
                    <Text
                        mb="8px"
                        fontSize={"sm"}
                        color={"grey"}
                        textShadow={" 1px 1px 1px cyan"}
                    >
                        After that, the dream will no longer be available to
                        fund. (Minimum 1 hour from now)
                    </Text>
                    <Box position="relative">
                        <Input
                            __css={{
                                "* ": {
                                    color: "white",
                                },
                                "* > .chakra-input css-lpwhw5": {
                                    color: "white",
                                },
                            }}
                            placeholder="Select Date and Time"
                            size="lg"
                            type="datetime-local"
                            focusBorderColor="white"
                            color={"white"}
                            value={formattedDate}
                            isInvalid={
                                date.getTime() <
                                new Date().getTime() + 3600 * 1000
                            }
                            onChange={(e) => {
                                setDate(new Date(e.target.value));
                            }}
                            zIndex={1}
                        />
                        <Box
                            w={"40px"}
                            h={"40px"}
                            position={"absolute"}
                            right={"7px"}
                            top={"5px"}
                            bg="white"
                            rounded="lg"
                            zIndex={0}
                            _hover={{
                                cursor: "pointer",
                            }}
                        ></Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default StepperDate;
