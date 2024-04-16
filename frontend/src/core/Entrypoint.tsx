import { FC } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesContainer from "./Router";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { GlobalProvider } from "../providers/global";
import { Toaster } from "react-hot-toast";

const colors = {
    transparent: "transparent",
    danger: "#FF0000",
    light: "#4AE3CB",
    regular: "#2B9BA2",
    dark: "#00003A",
    darkblue: "#000054",
    black: "#000000",
    metamaskWhite: "#bfae9e",
    metamaskLight: "#f6851b",
    metamaskDark: "#cd6116",
};

const theme = extendTheme({
    colors,
});
const Entrypoint: FC = () => {
    return (
        <ChakraProvider theme={theme}>
            <Toaster />
            <GlobalProvider>
                <Router>
                    <RoutesContainer />
                </Router>
            </GlobalProvider>
        </ChakraProvider>
    );
};

export default Entrypoint;
