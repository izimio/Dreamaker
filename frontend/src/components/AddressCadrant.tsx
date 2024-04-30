import {
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import * as ROUTES from "../constants/routes";

import {
    ChevronUpIcon,
    DragHandleIcon,
    LockIcon,
    StarIcon,
} from "@chakra-ui/icons";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CottageIcon from "@mui/icons-material/Cottage";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { useEthereum } from "../providers/ethereum";
import { useGlobal } from "../providers/global";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const AddressCadrant = (props: { address: string; DMKBalance: number }) => {
    const { chainId } = useEthereum();
    const { logout, user } = useGlobal();
    const location = useLocation();

    const [isOpened, setIsOpened] = useState(false);

    const chooseLabelColor = (url: string) => {
        if (location.pathname === url) {
            return "regular-2";
        }
        return "darkBlue+2  ";
    };

    return (
        <Menu
            onOpen={() => setIsOpened(true)}
            onClose={() => setIsOpened(false)}
        >
            <MenuButton>
                <Flex
                    gap={2}
                    p={2}
                    align={"center"}
                    rounded={"lg"}
                    bg={"federalBlue"}
                    _hover={{ cursor: "pointer" }}
                >
                    <Text userSelect={"none"}>
                        {props.address.substring(0, 10)}...{" "}
                        {props.address.substring(
                            props.address.length - 4,
                            props.address.length
                        )}
                    </Text>
                    <ChevronUpIcon
                        color={"white"}
                        w={8}
                        h={6}
                        style={{
                            transform: isOpened
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition: "all 0.3s",
                        }}
                    />
                </Flex>
            </MenuButton>
            <MenuList color={"black"} p={0} zIndex={999}>
                <MenuGroup title="Sections">
                    <Link to={ROUTES.HOME}>
                        <MenuItem
                            icon={
                                <Icon
                                    as={CottageIcon}
                                    color={chooseLabelColor(ROUTES.HOME)}
                                />
                            }
                        >
                            <Text>Home</Text>
                        </MenuItem>
                    </Link>
                    <Link to={ROUTES.DREAMS}>
                        <MenuItem
                            icon={
                                <Icon
                                    as={EmojiEventsIcon}
                                    color={chooseLabelColor(ROUTES.DREAMS)}
                                />
                            }
                        >
                            <Text>Dreams</Text>
                        </MenuItem>
                    </Link>
                    <Link to={ROUTES.PROFILE}>
                        <MenuItem
                            icon={
                                <Icon
                                    as={AccountCircleIcon}
                                    color={chooseLabelColor(ROUTES.PROFILE)}
                                />
                            }
                        >
                            <Text>Profile</Text>
                        </MenuItem>
                    </Link>
                    {user?.isAdmin && (
                        <Link to={ROUTES.ADMIN}>
                            <MenuItem
                                icon={
                                    <Icon
                                        as={AdminPanelSettingsIcon}
                                        color={chooseLabelColor(ROUTES.ADMIN)}
                                    />
                                }
                            >
                                <Text>Admin Panel</Text>
                            </MenuItem>
                        </Link>
                    )}
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="Account">
                    <MenuItem icon={<DragHandleIcon color={"dark"} />}>
                        <Text>ChainId: {chainId}</Text>
                    </MenuItem>
                    <MenuItem icon={<StarIcon color={"gold"} />}>
                        <Text>{props.DMKBalance} DMK</Text>
                    </MenuItem>
                    <MenuItem
                        _hover={{ bg: "red.200", color: "white" }}
                        icon={<LockIcon color={"red"} />}
                        onClick={logout}
                    >
                        Logout
                    </MenuItem>
                </MenuGroup>
            </MenuList>
        </Menu>
    );
};

export default AddressCadrant;
