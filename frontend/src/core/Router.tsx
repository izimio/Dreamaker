import { FC } from "react";
import { extendTheme } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getState } from "../utils/storage";

// ======= Constants ======= //
import * as ROUTES from "../constants/routes";

// ======= Pages ======= //
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";

// ======= Generics Components ======= //
import Upbar from "../components/Upbar";

const ProtectedRoute = ({ children }: any) => {
    if (!getState("token")) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

const RoutesContainer: FC = () => {
    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route
                path={ROUTES.DASHBOARD}
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
        </Routes>
    );
};

export default RoutesContainer;
