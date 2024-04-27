import { HDNodeWallet, ethers } from "ethers";
import { TAGS } from "../../utils/constants";
import { DreamModel, DreamStatus } from "../../models/dreamModel";
import * as dreamServices from "../../services/dream";

jest.spyOn(dreamServices, "createDreamOnChain").mockImplementation(async () => {
    return Promise.resolve("0x" + randomString(64));
});

export const randomString = (length: number): string => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
};

export const randomTags = (length: number): string[] => {
    const tags = [...TAGS];
    const result = [];
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * tags.length);
        result.push(tags[index]);
        tags.splice(index, 1);
    }
    return result;
};

const getDateNowInSeconds = (): number => {
    return Math.ceil(Date.now() / 1000);
};

export const createWallet = (
    privateKey?: string
): HDNodeWallet | ethers.Wallet => {
    if (privateKey) {
        return new ethers.Wallet(privateKey);
    }
    const wallet = ethers.Wallet.createRandom();
    return wallet;
};

export const authWallet = async (
    request: any,
    privateKey?: string
): Promise<{ wallet: HDNodeWallet | ethers.Wallet; token: string }> => {
    const wallet = createWallet(privateKey);

    const response = await request?.get(
        "/auth/challenge" + `/${wallet.address}`
    );
    expect(response?.status).toBe(201);
    expect(response?.body.ok).toBe(true);
    expect(response?.body.data.challenge).toBeDefined();

    const challenge = response?.body.data.challenge;
    const signature = await wallet.signMessage(challenge);

    const response2 = await request?.post("/auth/verify").send({
        address: wallet.address,
        signature: signature,
    });
    expect(response2?.status).toBe(200);
    expect(response2?.body.ok).toBe(true);
    expect(response2?.body.data.token).toBeDefined();

    const token = response2?.body.data.token;
    return { wallet, token };
};

export const createRandomDreamData = (
    params: {
        title?: string;
        description?: string;
        tags?: string[];
        deadlineTime?: number;
        targetAmount?: string;
    } = {}
) => {
    const title = params.title || randomString(10);
    const description = params.description || randomString(50);
    const tags = params.tags || randomTags(3);
    const deadlineTime =
        params.deadlineTime || getDateNowInSeconds() + 60 * 60 * 24 * 7;
    const targetAmount =
        params.targetAmount ||
        (Math.floor(Math.random() * 1e18) + 1).toString();

    return { title, description, tags, deadlineTime, targetAmount };
};

export const createRandomDream = async (
    request: any,
    signer:
        | {
              wallet: HDNodeWallet | ethers.Wallet;
              token: string;
          }
        | undefined,
    params: {
        title?: string;
        description?: string;
        tags?: string[];
        deadlineTime?: number;
        targetAmount?: string;
    } = {}
) => {
    const { title, description, tags, deadlineTime, targetAmount } =
        createRandomDreamData(params);

    const wSigner = signer || (await authWallet(request));

    // send form data
    const response = await request
        .post("/dream")
        .set("Authorization", `Bearer ${wSigner.token}`)
        .field("title", title)
        .field("description", description)
        .field("tags", tags.join(","))
        .field("deadlineTime", deadlineTime)
        .field("targetAmount", targetAmount.toString());
    expect(response?.status).toBe(201);
    expect(response?.body.ok).toBe(true);
    expect(response?.body.data.txHash).toBeDefined();
    expect(response?.body.data.dream).toBeDefined();
    expect(response?.body.data.dream._id).toBeDefined();
    expect(response?.body.data.dream.title).toBe(title);
    expect(response?.body.data.dream.description).toBe(description);
    expect(response?.body.data.dream.tags).toEqual(tags);
    expect(response?.body.data.dream.deadlineTime).toBe(deadlineTime);
    expect(response?.body.data.dream.targetAmount).toBe(
        targetAmount.toString()
    );
    expect(response?.body.data.dream.minFundingAmount).toBe(
        ethers.parseUnits("1", "wei").toString()
    );

    const dream = response?.body.data.dream;
    return {
        dream: {
            ...dream,
            id: dream._id,
        },
        wSigner,
    };
};

export const fundDream = async (
    request: any,
    params: {
        address?: string;
        dreamId?: string;
        amount?: bigint;
    } = {}
) => {
    const address = params.address || ethers.Wallet.createRandom().address;
    const amount: any =
        params.amount || BigInt(Math.floor(Math.random() * 1e18) + 1);
    let dreamId = params.dreamId;

    if (!params.dreamId) {
        const { dream } = await createRandomDream(request, undefined, {});
        dreamId = dream.id;
    }

    const r = await DreamModel.findOne({ _id: dreamId });
    expect(r).toBeDefined();
    if (!r) {
        throw new Error("Dream not found");
    }
    const funders = r.funders;
    const index = funders.findIndex((f) => f.address === address);
    if (index !== -1) {
        funders[index].amount += amount;
    } else {
        funders.push({ address, amount, refund: false });
    }

    r.funders = funders;
    r.status = DreamStatus.ACTIVE;

    await r.save();

    return { dreamId, address, amount };
};
