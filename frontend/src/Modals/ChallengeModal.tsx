import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";
import { useModals } from "../providers/modals";
import metamaskLogo from "/public/metamaskLogo.png";
import { getEthAccount } from "../ethereum/metamask";
import { useEffect, useState } from "react";

function ChallengeModal() {
    const { challengeModal } = useModals();
    const [address, setAddress] = useState<string>("");

    useEffect(() => {
        const getChallenge = async () => {
            const { ok, data } = await getEthAccount();
            if (!ok) {
                return;
            }
            setAddress(data);
        };
        getChallenge();
    }, []);

    return (
        <Modal isOpen={challengeModal} onClose={() => {}} isCentered={true}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign={"center"}>
                    ✍️ Sign the challenge in the Metamask extension
                </ModalHeader>
                <ModalBody
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={metamaskLogo}
                        alt={"metamask logo"}
                        style={{ width: "200px", height: "200px" }}
                    />
                    <Text mt={4} textAlign={"center"} fontSize={"md"}>
                        Using:{" "}
                        <span
                            style={{
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            {address}
                        </span>
                    </Text>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default ChallengeModal;
