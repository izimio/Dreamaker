import { ethers } from "ethers";
import { uploadFileToFirebase } from "../firebase/uploadFile";
import { DreamModel } from "../models/dreamModel";
import { ABIs, signer } from "../utils/EProviders";
import { DREAM_PROXY_FACTORY_ADDRESS } from "../utils/config";
import { InternalError, ObjectNotFoundError } from "../utils/error";
import fs from "fs";

type Asset = {
    type: string;
    link: string;
};

const uploadFilesToFirebase = async (
    files: {
        mimetype: string;
        filepath: string;
        newFilename: string;
    }[]
): Promise<Asset[]> => {
    const filePromises = [];
    const filesPaths = [];

    if (files.length === 0) {
        return [];
    }

    for (const file of files) {
        filePromises.push(
            uploadFileToFirebase(file.mimetype, file.filepath, file.newFilename)
        );
        filesPaths.push(file.filepath);
    }
    try {
        const res = await Promise.all(filePromises);

        // Delete files after uploading
        for (const file of filesPaths) {
            fs.unlinkSync(file);
        }

        return res.map((ret) => {
            const firebaseData = ret[1] as any;
            return {
                type: firebaseData.contentType,
                link: firebaseData.mediaLink,
            };
        });
    } catch (error: any) {
        throw new InternalError(
            "Failed to upload files to firebase: " + error.message
        );
    }
};

export const postDream = async (
    owner: string,
    title: string,
    tags: string[],
    description: string,
    deadlineTime: number,
    targetAmount: string,
    files: {
        mimetype: string;
        filepath: string;
        newFilename: string;
    }[]
) => {
    let assets: Asset[] = [];
    try {
        assets = await uploadFilesToFirebase(files);
    } catch (error: any) {
        throw new InternalError(
            "Failed to upload files to firebase: " + error.message
        );
    }
    try {
        const dream = await DreamModel.create({
            title,
            description,
            assets,
            tags,
            owner,
            deadlineTime,
            targetAmount,
        });
        return dream;
    } catch (error: any) {
        throw new InternalError("Failed to post dream: " + error.message);
    }
};

export const createDreamOnChain = async (
    owner: string,
    targetAmount: string,
    deadlineTime: number
) => {
    const proxyFactory = new ethers.Contract(
        DREAM_PROXY_FACTORY_ADDRESS,
        ABIs.ProxyFactory,
        signer
    );
    let txHash = "";
    try {
        const tx = await proxyFactory.deployClone(
            owner,
            ethers.parseUnits(targetAmount, "wei"),
            deadlineTime
        );
        await tx.wait();
        txHash = tx.hash;
    } catch (error: any) {
        throw new InternalError(
            "Failed to create dream on chain: " + error.message
        );
    }

    return txHash;
};
export const getDreams = async (
    params: {
        _id?: string;
        owner?: string;
        status?: string;
    } = {}
) => {
    const dreams = await DreamModel.find(
        {
            ...(params._id && { _id: params._id }),
            ...(params.owner && { owner: params.owner }),
            ...(params.status && { status: params.status }),
        },
        {
            __v: 0,
        }
    ).lean();

    const parsedBigIntToStringsDreams = dreams.map((dream) => {
        return {
            ...dream,
            funders: dream.funders.map((funder) => {
                return {
                    ...funder,
                    amount: funder.amount.toString(),
                };
            }),
            currentAmount: dream.funders
                .reduce(
                    (acc: bigint, funder) => acc + BigInt(funder.amount),
                    0n
                )
                .toString(),
        };
    });
    return parsedBigIntToStringsDreams;
};

export const updateDream = async (
    id: string,
    me: string,
    edits: {
        title?: string;
        description?: string;
        tags?: string[];
    }
) => {
    const dream = await DreamModel.findOneAndUpdate(
        { _id: id, owner: me },
        {
            $set: {
                ...(edits.title && { title: edits.title }),
                ...(edits.description && { description: edits.description }),
                ...(edits.tags && { tags: edits.tags }),
            },
        },
        { new: true }
    );

    if (!dream) {
        throw new ObjectNotFoundError("Dream not found or not owned by user");
    }

    return dream.toObject();
};

export const likeDream = async (id: string, me: string) => {
    const dream = await DreamModel.findOne({ _id: id });

    if (!dream) {
        throw new ObjectNotFoundError("Dream not found");
    }

    const likers = dream.likers;
    let likeStatus = true;

    if (likers.includes(me)) {
        likers.splice(likers.indexOf(me), 1);
        likeStatus = false;
    } else {
        likers.push(me);
    }

    dream.likers = likers;
    await dream.save();

    return {
        id: dream._id,
        likeStatus,
    };
};
