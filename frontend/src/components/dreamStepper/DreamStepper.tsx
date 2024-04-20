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
} from "@chakra-ui/react";
import StepperGeneral from "./StepperGeneral";

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
    const { activeStep, setActiveStep, goToNext, goToPrevious } = useSteps({
        count: steps.length,
    });

    // ============= States ============= //
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    // !!============= States =============!! //
    const activeStepContent = steps[activeStep];
    return (
        <Stack>
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
            <Text
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
                color="white"
                textShadow="1px 1px 1px cyan"
            >
                {activeStepContent.title}
            </Text>
            <Box mt={5} p={5} rounded="lg">
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
                            />
                        ),
                        // 1: <StepperGeneral />,
                        // 2: <StepperGeneral />,
                        // 3: <StepperGeneral />,
                        // 4: <StepperGeneral />,
                    }[activeStep]
                }
            </Box>
        </Stack>
    );
};

export default DreamStepper;
