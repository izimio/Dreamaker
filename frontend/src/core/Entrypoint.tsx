import { Component, FC, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesContainer from "./Router";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { GlobalProvider } from "../providers/global";
import { Toaster } from "react-hot-toast";
import Upbar from "../components/Upbar";
import Footer from "../components/Footer";
import { EthereumProvider } from "../providers/ethereum";
import { ModalsProviders } from "../providers/modals";
import { MultiSelectTheme } from "chakra-multiselect";

import { lightenColor, darkenColor } from "../utils/color";
import Loading from "../pages/Loading";
const colors: {
    [key: string]: string;
} = {
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

export const shadedColors: { [key: string]: string } = {};

Object.keys(colors).forEach((colorName) => {
    const color = colors[colorName];
    shadedColors[`${colorName}`] = color;
    shadedColors[`${colorName}+1`] = lightenColor(color, 0.1);
    shadedColors[`${colorName}+2`] = lightenColor(color, 0.2);
    shadedColors[`${colorName}+3`] = lightenColor(color, 0.3);
    shadedColors[`${colorName}+4`] = lightenColor(color, 0.4);
    shadedColors[`${colorName}+5`] = lightenColor(color, 0.5);

    shadedColors[`${colorName}-1`] = darkenColor(color, 0.1);
    shadedColors[`${colorName}-2`] = darkenColor(color, 0.2);
    shadedColors[`${colorName}-3`] = darkenColor(color, 0.3);
    shadedColors[`${colorName}-4`] = darkenColor(color, 0.4);
    shadedColors[`${colorName}-5`] = darkenColor(color, 0.5);
});

const theme = extendTheme({
    components: {
        MultiSelect: MultiSelectTheme,
    },
    colors: shadedColors,
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
                            <Box
                                style={{
                                    minHeight: "100vh",
                                    minWidth: "100vw",
                                }}
                            >
                                <Upbar />
                                <Box flex={1}>
                                    <Loading>
                                        <RoutesContainer />
                                    </Loading>
                                </Box>
                                <Footer />
                            </Box>
                        </Router>
                    </GlobalProvider>
                </EthereumProvider>
            </ModalsProviders>
        </ChakraProvider>
    );
};

export default Entrypoint;
