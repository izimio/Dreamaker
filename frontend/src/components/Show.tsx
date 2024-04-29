import { FC } from "react";

interface ShowProps {
    statement: boolean;
    children: JSX.Element;
}

export const Show: FC<ShowProps> = ({ statement, children }) => {
    if (!statement) {
        return null;
    }
    return <>{children}</>;
};

export default Show;
