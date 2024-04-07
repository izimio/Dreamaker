import { uploadFileToFirebase } from "../firebase/uploadFile";
import { DreamModel } from "../models/dreamModel";
import { InternalError } from "../utils/error";

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

    if (files.length === 0) {
        return [];
    }

    for (const file of files) {
        filePromises.push(
            uploadFileToFirebase(file.mimetype, file.filepath, file.newFilename)
        );
    }
    try {
        const res = await Promise.all(filePromises);
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
    description: string,
    deadlineTime: bigint,
    targetAmount: bigint,
    minFundingAmount: bigint,
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

    const dream = new DreamModel({
        title,
        description,
        assets,
        owner,
    });
};
