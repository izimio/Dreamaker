import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getState } from "../utils/storage";

// ======= Constants ======= //
import * as ROUTES from "../constants/routes";

// ======= Pages ======= //
import Home from "../pages/Home";
import Dreams from "../pages/Dreams";
import Profile from "../pages/Profile";

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
                path={ROUTES.DREAMS}
                element={
                    <ProtectedRoute>
                        <Dreams />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.PROFILE}
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
        </Routes>
    );
};

export default RoutesContainer;
