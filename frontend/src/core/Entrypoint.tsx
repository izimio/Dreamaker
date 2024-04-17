import { FC, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesContainer from "./Router";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { GlobalProvider } from "../providers/global";
import { Toaster } from "react-hot-toast";
import Upbar from "../components/Upbar";
import Footer from "../components/Footer";
import { EthereumProvider } from "../providers/ethereum";
import { ModalsProviders } from "../providers/modals";

const colors = {
    transparent: "transparent",
    danger: "#FF0000",
    light: "#4AE3CB",
    regular: "#2B9BA2",
    dark: "#00003A",
    darkBlue: "#000054",
    federalBlue: "#000054ff",
    black: "#000000",
    metamaskWhite: "#bfae9e",
    metamaskLight: "#f6851b",
    metamaskDark: "#cd6116",
};

const theme = extendTheme({
    colors,
});
const Entrypoint: FC = () => {
    useEffect(() => {}, [window.screen.width]);
    return (
        <ChakraProvider theme={theme}>
            <Toaster />
            <ModalsProviders>
                <EthereumProvider>
                    <GlobalProvider>
                        <Router>
                            <Upbar />
                            <Box flex={1}>
                                <RoutesContainer />
                            </Box>
                            <Footer />
                        </Router>
                    </GlobalProvider>
                </EthereumProvider>
            </ModalsProviders>
        </ChakraProvider>
    );
};

export default Entrypoint;
