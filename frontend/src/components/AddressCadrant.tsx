import {
    Box,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import { DragHandleIcon, LockIcon, StarIcon } from "@chakra-ui/icons";

import toast from "react-hot-toast";
import { useEthereum } from "../providers/ethereum";
import { useGlobal } from "../providers/global";

const AddressCadrant = (props: { address: string; DMKBalance: number }) => {
    const { chainId } = useEthereum();
    const { logout } = useGlobal();
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
                <MenuItem icon={<DragHandleIcon color={"gold"} />}>
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
            </MenuList>
        </Menu>
    );
};

export default AddressCadrant;
