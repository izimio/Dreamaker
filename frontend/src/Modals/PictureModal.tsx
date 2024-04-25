import {
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Image,
} from "@chakra-ui/react";
import { useModals } from "../providers/modals";

function PictureModal() {
    const { pictureModal, switchPictureModal } = useModals();
    return (
        <Modal
            isOpen={!!pictureModal}
            onClose={() => {
                switchPictureModal("");
            }}
            isCentered={true}
            size={"4xl"}
        >
            <ModalOverlay />
            <ModalContent bg={"transparent"}>
                <ModalBody>
                    <Image
                        src={pictureModal}
                        alt={"Dream image"}
                        w={"100%"}
                        h={"100%"}
                        objectFit={"cover"}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default PictureModal;
