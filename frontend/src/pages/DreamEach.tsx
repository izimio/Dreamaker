import { Box } from "@chakra-ui/react";
import { FC } from "react";
import { DREAMS } from "../constants/routes";
import { useNavigate, useParams } from "react-router-dom";

const Dream: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) {
        navigate(DREAMS);
    }

    return (
        <Box>
            <h1>Dream</h1>
            <p>ID: {id}</p>
        </Box>
    );
};

export default Dream;
