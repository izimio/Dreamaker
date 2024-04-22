import { FC } from "react";
import {
    Box,
    Center,
    useColorModeValue,
    Heading,
    Progress,
    Stack,
    Image,
    Badge,
    Flex,
    Icon,
    Tooltip,
} from "@chakra-ui/react";
import defaultBg from "/assets_fallback.jpg";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { IDream } from "../providers/global";

const getSeedFromId = (id: string) => {
    return Number(BigInt("0x" + id));
};

const colorSchemes = [
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "blue",
    "cyan",
    "purple",
    "pink",
];

const DreamCard: FC<{ dream: IDream }> = ({ dream }) => {
    console.log(dream);
    const seed = getSeedFromId(dream._id);
    const refColorScheme = colorSchemes[seed % colorSchemes.length];
    const image = dream.assets.length > 0 ? dream.assets[0].link : defaultBg;
    const percentFunded =
        (BigInt(dream.currentAmount) * BigInt(100)) /
        BigInt(dream.targetAmount);

    return (
        <Center py={12}>
            <Box
                role={"group"}
                p={6}
                maxW={"330px"}
                w={"full"}
                bg={useColorModeValue("white", "gray.800")}
                boxShadow={"2xl"}
                rounded={"lg"}
                pos={"relative"}
                zIndex={1}
                cursor={"pointer"}
            >
                <Box
                    rounded={"lg"}
                    mt={-12}
                    pos={"relative"}
                    height={"230px"}
                    _after={{
                        transition: "all .3s ease",
                        content: '""',
                        w: "full",
                        h: "full",
                        pos: "absolute",
                        top: 5,
                        left: 0,
                        backgroundImage: `url(${image})`,
                        filter: "blur(15px)",
                        zIndex: -1,
                    }}
                    _groupHover={{
                        _after: {
                            filter: "blur(20px)",
                        },
                    }}
                >
                    <Image
                        rounded={"lg"}
                        height={230}
                        width={282}
                        objectFit={"cover"}
                        src={image}
                    />
                </Box>
                <Stack pt={10} align={"center"}>
                    <Flex align={"center"} gap={2} flexWrap={"wrap"} justify={"center"} m={1}>
                        {dream.tags.map((tag: string) => (
                            <Badge
                                key={tag}
                                colorScheme={refColorScheme}
                                variant="solid"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </Flex>
                    <Heading
                        fontSize={"2xl"}
                        fontFamily={"body"}
                        fontWeight={500}
                        textAlign={"center"}
                    >
                        {dream.title}
                    </Heading>
                    <Flex
                        width={"100%"}
                        justify={"space-between"}
                        align={"center"}
                        gap={5}
                    >
                        <Tooltip
                            label={`${percentFunded}%`}
                            aria-label="A tooltip"
                        >
                            <Progress
                                value={Number(percentFunded)}
                                colorScheme={refColorScheme}
                                hasStripe
                                w={"100%"}

                            />
                        </Tooltip>
                        <Tooltip
                            label={`${dream.targetAmount}   wei`}
                            aria-label="A tooltip"
                        >
                            <Icon
                                as={EmojiEventsIcon}
                                color={
                                    percentFunded >= 100
                                        ? refColorScheme
                                        : "gray.600"
                                }
                                bg={"gray.100"}
                                borderRadius={"full"}
                                p={1}
                            />
                        </Tooltip>
                    </Flex>
                </Stack>
            </Box>
        </Center>
    );
};

export default DreamCard;
