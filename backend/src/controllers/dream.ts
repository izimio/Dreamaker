import { Context } from 'koa';
import { uploadFileToFirebase } from '../firebase/uploadFile';
import { DreamModel } from '../models/dreamModel';
import { InternalError } from '../utils/error';
import { Bucket } from '@google-cloud/storage';

const uploadFilesToFirebase = async (files: {
    mimetype: string,
    filepath: string,
    newFilename: string
}[]) => {
    const filePromises = [];

    if (files.length === 0) {
        return;
    }

    for (const file of files) {
        filePromises.push(uploadFileToFirebase(file.mimetype, file.filepath, file.newFilename));
    }
    try {
        const res = await Promise.all(filePromises);
        return res.map((ret) => {
            const firebaseData = ret[1] as any;
            return {
                type: firebaseData.contentType,
                link: firebaseData.mediaLink,
            }
        })
    } catch (error: any) {
        throw new InternalError('Failed to upload files to firebase: ' + error.message);
    }
}

export const createDream = async (ctx: Context) => {

    const files = ctx.request.files as { [key: string]: any } || {};
    const { title, description } = ctx.request.body;

    console.log(title, description);
    const fileArray = Object.values(files).map((file: any) => {
        return {
            mimetype: file.mimetype,
            filepath: file.filepath,
            newFilename: file.newFilename,
        };
    });
    const data = await uploadFilesToFirebase(fileArray);
    console.log(data);
    ctx.body = {
        message: 'Dream created',
    };


};
