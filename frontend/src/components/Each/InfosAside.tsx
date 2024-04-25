import {
    Box,
    Heading,
    List,
    ListIcon,
    ListItem,
    Stack,
    Tooltip,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import StyleIcon from "@mui/icons-material/Style";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import SavingsIcon from "@mui/icons-material/Savings";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

import { IDream, useGlobal } from "../../providers/global";
import { SettingsIcon } from "@chakra-ui/icons";
import EditDreamModal from "../../Modals/EditDreamModal";
import StatusBox from "../StatusBox";

interface InfosAsideProps {
    dream: IDream;
}

const parseSeconds = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (num: number) => num.toString().padStart(2, "0");

    const components = [];

    if (days > 0) {
        components.push(`${pad(days)}d`);
    }

    if (hours > 0 || days === 0) {
        components.push(`${pad(hours)}h`);
    }

    if (minutes > 0 || (hours === 0 && days === 0)) {
        components.push(`${pad(minutes)}m`);
    }

    components.push(`${pad(secs)}s`);

    return components.join(" ");
};

const InfosAside: FC<InfosAsideProps> = ({ dream }) => {
    const { user } = useGlobal();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [remainingBoostTime, setRemainingBoostTime] = useState<number | null>(
        null
    );
    const [remainingDeadlineTime, setRemainingDeadlineTime] = useState<
        number | null
    >(null);

    useEffect(() => {
        if (new Date(dream.boostedUntil) > new Date()) {
            const diff = new Date(dream.boostedUntil).getTime() - Date.now();
            setRemainingBoostTime(diff);
            const timer = setInterval(() => {
                const newDiff =
                    new Date(dream.boostedUntil).getTime() - Date.now();
                setRemainingBoostTime(newDiff);

                const newDeadlineDiff =
                    new Date(dream.deadlineTime * 1000).getTime() - Date.now();
                setRemainingDeadlineTime(newDeadlineDiff);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setRemainingBoostTime(null);
        }

        const diffDeadline =
            new Date(dream.deadlineTime * 1000).getTime() - Date.now();
        setRemainingDeadlineTime(diffDeadline);
    }, [dream.boostedUntil, dream.deadlineTime]);

    return (
        <>
            <EditDreamModal
                id={dream._id}
                isOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                prevValues={{
                    title: dream.title,
                    description: dream.description,
                    tags: dream.tags,
                }}
            />
            <Stack
                position={"relative"}
                borderRadius={4}
                w={"100%"}
                justify={"space-evenly"}
            >
                {user?.address == dream.owner && (
                    <Box
                        position={"absolute"}
                        top={0}
                        right={0}
                        zIndex={1}
                        animation={"spin 10s linear infinite"}
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        <Tooltip label="Edit Dream">
                            <SettingsIcon
                                w="25px"
                                h="25px"
                                color={"regular"}
                                cursor={"pointer"}
                                _hover={{
                                    animation: "spin 2s linear infinite",
                                }}
                            />
                        </Tooltip>
                    </Box>
                )}

                <Heading
                    fontSize="4xl"
                    textAlign="center"
                    fontWeight={"bold"}
                    bgGradient={"linear(to-bl, light, federalBlue)"}
                    bgClip="text"
                    textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                    pb={1}
                    mt={2}
                >
                    {dream.title}
                </Heading>
                <Stack spacing={4} mt={4}>
                    <Box>
                        <Heading
                            fontSize="2xl"
                            fontWeight={"bold"}
                            bgGradient={"linear(to-bl, light, federalBlue)"}
                            bgClip="text"
                            textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                            mb={2}
                        >
                            Description:
                        </Heading>
                        <Box
                            border={"1px solid darkcyan"}
                            p={4}
                            rounded={"md"}
                            textAlign={"justify"}
                            wordBreak={"break-word"}
                        >
                            {dream.description}
                        </Box>
                    </Box>
                    <Box>
                        <Heading
                            fontSize="2xl"
                            fontWeight={"bold"}
                            bgGradient={"linear(to-bl, light, federalBlue)"}
                            bgClip="text"
                            textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                            mb={2}
                        >
                            Infos:
                        </Heading>
                        <List
                            spacing={3}
                            border={"1px solid darkcyan"}
                            borderRadius={10}
                            p={4}
                        >
                            <ListItem display={"flex"} alignItems={"center"}>
                                <ListIcon
                                    as={FiberNewIcon}
                                    color={"darkcyan"}
                                />
                                Created at: {"      "}
                                <span
                                    style={{
                                        color: "darkcyan",
                                        marginLeft: "5px",
                                    }}
                                >
                                    {new Date(
                                        dream.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </ListItem>
                            <ListItem display={"flex"} alignItems={"center"}>
                                <ListIcon
                                    as={RocketLaunchIcon}
                                    color={"darkcyan"}
                                />
                                Boosted:{" "}
                                {new Date(dream.boostedUntil) > new Date() ? (
                                    <Tooltip
                                        label={new Date(
                                            dream.boostedUntil
                                        ).toLocaleString()}
                                        aria-label="A tooltip"
                                        placement="right"
                                    >
                                        <span
                                            style={{
                                                color: "darkcyan",
                                                marginLeft: "5px",
                                            }}
                                        >
                                            {remainingBoostTime
                                                ? parseSeconds(
                                                      remainingBoostTime / 1000
                                                  )
                                                : "Calculating..."}
                                        </span>
                                    </Tooltip>
                                ) : (
                                    <span
                                        style={{
                                            color: "red",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        Not boosted
                                    </span>
                                )}
                            </ListItem>
                            <ListItem display={"flex"} alignItems={"center"}>
                                <ListIcon
                                    as={AccessAlarmIcon}
                                    color={"darkcyan"}
                                />
                                Deadline:{" "}
                                <Tooltip
                                    label={new Date(
                                        dream.deadlineTime * 1000
                                    ).toLocaleString()}
                                    aria-label="A tooltip"
                                    placement="right"
                                >
                                    <span
                                        style={{
                                            color: "darkcyan",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        {remainingDeadlineTime
                                            ? parseSeconds(
                                                  remainingDeadlineTime / 1000
                                              )
                                            : "Calculating..."}
                                    </span>
                                </Tooltip>
                            </ListItem>
                            <ListItem display={"flex"} alignItems={"center"}>
                                <ListIcon as={StyleIcon} color={"darkcyan"} />
                                Tags:{" "}
                                <span
                                    style={{
                                        color: "darkcyan",
                                        marginLeft: "5px",
                                    }}
                                >
                                    {dream.tags.join(", ")}
                                </span>
                            </ListItem>

                            <ListItem display={"flex"} alignItems={"center"}>
                                <ListIcon
                                    as={ModeStandbyIcon}
                                    color={"darkcyan"}
                                />
                                <Tooltip
                                    placement="right"
                                    label={
                                        ethers.formatUnits(
                                            dream.targetAmount,
                                            "wei"
                                        ) + " WEI"
                                    }
                                    aria-label="A tooltip"
                                >
                                    <span>
                                        Target amount:{" "}
                                        <span
                                            style={{
                                                color: "darkcyan",
                                            }}
                                        >
                                            {ethers.formatEther(
                                                dream.targetAmount
                                            )}{" "}
                                            ETH
                                        </span>
                                    </span>
                                </Tooltip>
                            </ListItem>
                            <ListItem display={"flex"} alignItems={"center"}>
                                <ListIcon
                                    as={CloseFullscreenIcon}
                                    color={"darkcyan"}
                                />
                                <Tooltip
                                    placement="right"
                                    label={
                                        ethers.formatUnits(
                                            dream.minFundingAmount,
                                            "wei"
                                        ) + " WEI"
                                    }
                                    aria-label="A tooltip"
                                >
                                    <span style={{}}>
                                        Minimal funding amount:{" "}
                                        <span
                                            style={{
                                                color: "darkcyan",
                                            }}
                                        >
                                            {ethers.formatEther(
                                                dream.minFundingAmount
                                            )}{" "}
                                            ETH
                                        </span>
                                    </span>
                                </Tooltip>
                            </ListItem>

                            <ListItem display={"flex"} alignItems={"center"}>
                                <ListIcon
                                    as={PrecisionManufacturingIcon}
                                    color={"darkcyan"}
                                />
                                Proxy address:{" "}
                                <span
                                    style={{
                                        color: "darkcyan",
                                        marginLeft: "5px",
                                    }}
                                >
                                    {dream.proxyAddress
                                        ? dream.proxyAddress
                                        : "Deploying..."}
                                </span>
                            </ListItem>
                            <ListItem display={"flex"} alignItems={"center"}>
                                <ListIcon as={SavingsIcon} color={"darkcyan"} />
                                <Tooltip
                                    placement="right"
                                    label={
                                        ethers.formatUnits(
                                            dream.currentAmount,
                                            "wei"
                                        ) + " WEI"
                                    }
                                    aria-label="A tooltip"
                                >
                                    <span style={{}}>
                                        Funded amount:{" "}
                                        <span
                                            style={{
                                                color: "darkcyan",
                                            }}
                                        >
                                            {ethers.formatEther(
                                                dream.currentAmount
                                            )}{" "}
                                            ETH
                                        </span>
                                    </span>
                                </Tooltip>
                            </ListItem>
                            <ListItem display={"flex"} alignItems={"center"}>
                                <ListIcon
                                    as={AccountCircleIcon}
                                    color={"darkcyan"}
                                />
                                Owner:{" "}
                                <span
                                    style={{
                                        color: "darkcyan",
                                        marginLeft: "5px",
                                    }}
                                >
                                    {dream.owner}
                                </span>
                            </ListItem>
                        </List>
                    </Box>

                    <Box>
                        <Heading
                            fontSize="2xl"
                            fontWeight={"bold"}
                            bgGradient={"linear(to-bl, light, federalBlue)"}
                            bgClip="text"
                            textShadow="3px 3px 0px rgba(0,0,0,0.1)"
                            mb={2}
                        >
                            Status:
                        </Heading>
                        <StatusBox status={dream.status} />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default InfosAside;
