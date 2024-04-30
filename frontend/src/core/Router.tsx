import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getState } from "../utils/storage";

// ======= Constants ======= //
import * as ROUTES from "../constants/routes";

// ======= Pages ======= //
import Home from "../pages/Home";
import Dreams from "../pages/Dreams";
import Profile from "../pages/Profile";
import CreateDream from "../pages/CreateDream";
import Dream from "../pages/DreamEach";
import toast from "react-hot-toast";
import AdminPanel from "../pages/Admin";

const ProtectedRoute = ({ children }: any) => {
    if (!getState("token")) {
        toast.dismiss("protected-route");
        toast.error("You need to be logged in to access this page", {
            id: "protected-route",
        });
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
                path={ROUTES.DREAM}
                element={
                    <ProtectedRoute>
                        <Dream />
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
            <Route
                path={ROUTES.CREATE_DREAM}
                element={
                    <ProtectedRoute>
                        <CreateDream />
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.ADMIN}
                element={
                    <ProtectedRoute>
                        <AdminPanel />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
        </Routes>
    );
};

export default RoutesContainer;
