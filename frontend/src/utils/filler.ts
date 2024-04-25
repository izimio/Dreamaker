import { IDream } from "../providers/global";
import { FILLER_IDS } from "./env.config";

const defaultDream = {
    createdAt: "2021-10-10T10:10:10.000Z",
    description: "This is a boosted dream",
    _id: FILLER_IDS[0],
    owner: "0x791AFE27366c8AD8F04481ebBD72b37948Cc52d2",
    status: "",
    deadlineTime: 999999999999999,
    targetAmount: "1000000000000000000",
    currentAmount: "10000000000000000000",
    proxyAddress: "0x791AFE27366c8AD8F04481ebBD72b37948Cc52d2",
    minFundingAmount: "1",
    funders: [],
    boosted: false,
};
export const defaultBoostedDream: IDream = {
    assets: [
        {
            link: "/fillerBoosted.png",
            type: "image/png",
        },
    ],
    title: "Your boosted dream",
    tags: ["BOOSTED"],
    ...defaultDream,
};

export const defaultHotDream: IDream = {
    ...defaultDream,
    assets: [
        {
            link: "/fillerHot.jpg",
            type: "image/png",
        },
    ],
    title: "Less than 24 hours left!",
    tags: ["HOT"],
    currentAmount: "899999999900000000",
    _id: FILLER_IDS[1],
};
