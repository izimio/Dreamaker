import { Box, Button } from "@chakra-ui/react";
import { FC, useState } from "react";
import { IDream, useGlobal } from "../../providers/global";
import InteractionModal from "../../modals/InteractionModals";

interface InteractionButtonsProps {
    dream: IDream;
}

interface buttonProps {
    text: string;
    color: string;
    callback: () => void;
}

const ButtonSpec: FC<buttonProps> = ({ text, color, callback }) => {
    return (
        <Button colorScheme={color} width={"100%"} onClick={callback}>
            {text}
        </Button>
    );
};

const InteractionButtons: FC<InteractionButtonsProps> = ({ dream }) => {
    const { user } = useGlobal();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState({
        type: "",
        colorScheme: "",
    });
    const buttonArray = [];

    if (
        user?.address.toLowerCase() === dream.owner.toLowerCase() &&
        dream.status === "reached"
    ) {
        buttonArray.push({
            text: "Withdraw 💎",
            color: "green",
            callback: () => {
                setType({
                    type: "withdraw",
                    colorScheme: "green",
                });
                setIsModalOpen(true);
            },
        });
    }

    if (
        user?.address.toLocaleLowerCase() !== dream.owner.toLowerCase() &&
        dream.status === "active"
    ) {
        buttonArray.push({
            text: "Fund 🎁",
            color: "blue",
            callback: () => {
                setType({
                    type: "fund",
                    colorScheme: "blue",
                });
                setIsModalOpen(true);
            },
        });
    }
    if (dream.status === "active") {
        buttonArray.push({
            text: "Boost 🚀",
            color: "purple",
            callback: () => {
                setType({
                    type: "boost",
                    colorScheme: "purple",
                });
                setIsModalOpen(true);
            },
        });
    }

    if (
        user?.address.toLowerCase() !== dream.owner.toLowerCase() &&
        dream.status === "expired" &&
        dream.funders.find(
            (funder) =>
                funder.address.toLowerCase() === user?.address.toLowerCase() &&
                funder.refund === false
        )
    ) {
        buttonArray.push({
            text: "Refund 💸",
            color: "red",
            callback: () => {
                setType({
                    type: "refund",
                    colorScheme: "red",
                });
                setIsModalOpen(true);
            },
        });
    }
    return (
        <>
            <InteractionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={type.type}
                colorScheme={type.colorScheme}
                proxyAddress={dream.proxyAddress}
                minimumFundingAmount={dream.minFundingAmount}
                dreamId={dream._id}
            />
            <Box
                height={"100%"}
                display={"flex"}
                justifyContent={"center"}
                gap={"1em"}
                alignItems={"end"}
            >
                {buttonArray.map((button, index) => (
                    <ButtonSpec
                        key={index}
                        text={button.text}
                        color={button.color}
                        callback={button.callback}
                    />
                ))}
            </Box>
        </>
    );
};

export default InteractionButtons;
