import PersistentFile from "formidable/PersistentFile";
import Bucket from "./Bucket";
import fs from "fs";

export async function uploadFileToFirebase(
    mimetype: string,
    filepath: string,
    newFilename: string
) {
    const fileStream = fs.createReadStream(filepath);
    const metadata = {
        contentType: mimetype,
    };
    return Bucket.upload(filepath, {
        destination: newFilename,
        metadata: metadata,
        public: true,
        resumable: false,
    });
}

export const deleteFileFromFirebase = async (url: string) => {
    const fileRef = Bucket.file(url);
    await fileRef.delete();
    return true;
};
