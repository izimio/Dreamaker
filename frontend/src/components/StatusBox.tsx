import { Box } from "@chakra-ui/react";
import { darken, lighten } from "polished";
import { FC } from "react";

interface StatusBoxProps {
    status: string;
}

const StatusBox: FC<StatusBoxProps> = ({ status }) => {
    let bg = "red.300";
    let color = "red.800";
    let text = "";

    switch (status) {
        case "active":
            bg = "green.300";
            color = "green.800";
            text = "Active";
            break;
        case "pending_validation":
            bg = "yellow.300";
            color = "yellow.800";
            text = "Pending validation";
            break;
        case "reached":
            bg = "blue.300";
            color = "blue.800";
            text = "Target Reached";
            break;
        case "expired":
            bg = "red.300";
            color = "red.800";
            text = "Expired";
            break;
        case "withdrawn":
            bg = lighten(0.1, "gold");
            color = darken(0.3, "gold");
            text = "That dream became true";
            break;
    }

    return (
        <Box
            textAlign={"center"}
            bg={bg}
            p={4}
            rounded={"md"}
            fontWeight={"bold"}
            color={color}
        >
            {text}
        </Box>
    );
};

export default StatusBox;
