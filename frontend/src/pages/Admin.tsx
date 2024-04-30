import { Box, Container, Spinner } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { useGlobal } from "../providers/global";
import { useNavigate } from "react-router-dom";
import { HOME } from "../constants/routes";

const AdminPanel: FC = () => {
    const { user } = useGlobal();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            return;
        }
        if (!user.isAdmin) {
            navigate(HOME);
        }
    }, [user, navigate]);


    if (!user) {
        return (
            <Box
                minH={"100vh"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Spinner size="xl" />
            </Box>
        );
    }
    return (
        <Box>
            <Container
                my={10}
                maxW={{
                    base: "100%",
                    md: "container.md",
                    xl: "container.xl",
                }}
            >
                Admin Panel
            </Container>
        </Box>
    );
};

export default AdminPanel;
