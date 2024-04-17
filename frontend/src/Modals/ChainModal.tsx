import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";
import { useModals } from "../providers/modals";
import metamaskLogo from "/public/metamaskLogo.png";

function ChainModal() {
    const { chainModal, switchChainModal } = useModals();
    return (
        <Modal
            isOpen={chainModal}
            onClose={() => {}}
            isCentered={true}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign={"center"}>🚧 Unsupported Chain </ModalHeader>
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
                    <Text mt={4} textAlign={"center"}>
                        Please switch to the supported chain to continue using
                        Metamask
                    </Text>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default ChainModal;
