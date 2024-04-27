import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";
import { useModals } from "../providers/modals";
import metamaskLogo from "/metamaskLogo.png";

function AccountChangedModal() {
    const { accountChangedModal } = useModals();

    return (
        <Modal
            isOpen={accountChangedModal}
            onClose={() => {}}
            isCentered={true}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign={"center"}>
                    🔄 Account changed in Metamask
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
                        Please connect your new account to continue using the
                        application
                    </Text>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default AccountChangedModal;
