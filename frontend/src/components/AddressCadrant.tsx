import {
    Box,
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

import { DragHandleIcon, LockIcon, StarIcon } from "@chakra-ui/icons";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CottageIcon from "@mui/icons-material/Cottage";

import toast from "react-hot-toast";
import { useEthereum } from "../providers/ethereum";
import { useGlobal } from "../providers/global";
import { Link, useLocation } from "react-router-dom";

const AddressCadrant = (props: { address: string; DMKBalance: number }) => {
    const { chainId } = useEthereum();
    const { logout } = useGlobal();
    const location = useLocation();

    const chooseLabelColor = (url: string) => {
        if (location.pathname === url) {
            return "regular-2";
        }
        return "darkBlue+2  ";
    };

    return (
        <Menu>
            <MenuButton>
                <Box
                    p={2}
                    rounded={"lg"}
                    bg={"federalBlue"}
                    _hover={{ cursor: "pointer" }}
                    onClick={() => {
                        navigator.clipboard.writeText(props.address);
                        toast.dismiss("address-copied-toast");
                        toast.success("Address copied to clipboard", {
                            icon: "📋",
                            id: "address-copied-toast",
                            duration: 800,
                        });
                    }}
                >
                    <Text userSelect={"none"}>
                        {props.address.substring(0, 15) + "..."}
                    </Text>
                </Box>
            </MenuButton>
            <MenuList color={"black"} p={0}>
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
                        Loggout
                    </MenuItem>
                </MenuGroup>
            </MenuList>
        </Menu>
    );
};

export default AddressCadrant;
