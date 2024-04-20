import { FC, useState } from "react";
import {
    Box,
    Text,
    Stack,
    Stepper,
    StepIndicator,
    Step,
    StepStatus,
    StepIcon,
    useSteps,
    StepSeparator,
    Button,
    Center,
    Divider,
} from "@chakra-ui/react";
import StepperGeneral from "./StepperGeneral";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import IconButton from "../IconButton";
import StepperPrice from "./StepperPrice";
import StepperDate from "./StepperDate";

const DreamStepper: FC = () => {
    const steps = [
        { title: "Make that dream come true", description: "Contact Info" },
        {
            title: "How much do you need to fulfill it ?",
            description: "Select Rooms",
        },
        { title: "When will you wake up ?", description: "Date & Time" },
        { title: "Visualize your dream", description: "Date & Time" },
        { title: "Let's go ?", description: "Skyrocket your hopes" },
    ];
    const { activeStep, goToNext, goToPrevious } = useSteps({
        index: 2,
        count: steps.length,
    });
    // ============= States ============= //
    const [valideStep, setValideStep] = useState<boolean[]>([
        false,
        false,
        false,
        false,
        false,
    ]);
    console.log(valideStep)

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const [price, setPrice] = useState<{
        amount: string;
        currency: "ETH" | "GWEI" | "WEI";
    }>({
        amount: "0",
        currency: "ETH",
    });
    
    const [date, setDate] = useState<Date>(() => {
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 1);
        currentDate.setMinutes(currentDate.getMinutes() + 1);
        return currentDate;
      });
    // !!============= States =============!! //
    const activeStepContent = steps[activeStep];
    return (
        <Stack
            style={{
                minHeight: "500px",
            }}
        >
            <Stepper size="sm" index={activeStep} gap="0" colorScheme="cyan">
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus complete={<StepIcon />} />
                        </StepIndicator>
                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>
            <Box
                mt={5}
                p={5}
                rounded="lg"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                flex={1}
            >
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    textAlign="center"
                    color="white"
                    textShadow="1px 1px 1px cyan"
                    mb={5}
                >
                    {activeStepContent.title}
                </Text>
                {
                    {
                        0: (
                            <StepperGeneral
                                name={name}
                                description={description}
                                tags={tags}
                                setName={setName}
                                setDescription={setDescription}
                                setTags={setTags}
                                setValideStep={(f) => {
                                    valideStep[0] = f;
                                    setValideStep([...valideStep]);
                                }}
                            />
                        ),
                        1: (
                            <StepperPrice
                                price={price}
                                setPrice={setPrice}
                                setValideStep={(f) => {
                                    valideStep[1] = f;
                                    setValideStep([...valideStep]);
                                }}
                            />
                        ),

                        2: (
                            <StepperDate
                                date={date}
                                setDate={setDate}
                                setValideStep={(f) => {
                                    valideStep[2] = f;
                                    setValideStep([...valideStep]);
                                }}
                            />
                        ),
                        // 3: <StepperGeneral />,
                        // 4: <StepperGeneral />,
                    }[activeStep]
                }
                <Center mt={5} gap={5}>
                    {activeStep !== 0 && (
                        <IconButton
                            icon={<ArrowLeftIcon />}
                            text="Back"
                            reverse={true}
                            disable={false}
                            onClick={goToPrevious}
                        />
                    )}
                    {/* <Box></Box> */}
                    {activeStep !== steps.length - 1 && (
                        <IconButton
                            icon={<ArrowRightIcon />}
                            text="Next"
                            disable={!valideStep[activeStep]}
                            onClick={() => {
                                console.log(valideStep);
                                if (valideStep[activeStep]) {
                                    goToNext();
                                }
                            }}
                        />
                    )}
                </Center>
            </Box>
        </Stack>
    );
};

export default DreamStepper;
