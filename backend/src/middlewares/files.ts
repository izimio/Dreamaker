import koaBody from "koa-body";
import { ValidationError } from "yup";
import { ALLOWED_EXTENSIONS } from "../utils/constants";
import { UPLOAD_PATH } from "../utils/config";

export const filesMiddleware = koaBody({
    formidable: {
        maxFieldsSize: 10 * 1024 * 1024,
        maxFiles: 5,
        uploadDir: UPLOAD_PATH,
        filename(name, ext) {
            const timestamp =
                new Date().getTime() + Math.floor(Math.random() * 1000);
            return `${timestamp}-${name}${ext}`;
        },
        onFileBegin: (_, file) => {
            if (!ALLOWED_EXTENSIONS.includes(file.mimetype || "")) {
                throw new ValidationError(
                    `Invalid file type, only theses types are allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
                );
            }
        },
        keepExtensions: true,
    },
    multipart: true,
});
