import yup, {
    string,
    number,
    object,
    array,
    mixed,
    ValidationError,
} from "yup";
import { ALLOWED_EXTENSIONS, TAGS } from "./constants";
import { ethers } from "ethers";

const min1 = 60;
const h1 = min1 * 60;
const d1 = h1 * 24;
const m1 = d1 * 30;
const y1 = m1 * 12;

export const validateEthAddress = string()
    .required()
    .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

export const validateVerifyEcRecoverChallenge = object()
    .shape({
        address: validateEthAddress,
        signature: string().required(),
    })
    .noUnknown();

export const validateEditDream = object()
    .shape({
        title: string().min(5).max(50),
        description: string().min(20).max(500),
    })
    .noUnknown();

export const parseFormData = (formData: {
    title?: string;
    description?: string;
    deadlineTime?: string;
    targetAmount?: string;
    tags?: string;
    minFundingAmount?: string;
}) => {
    return {
        title: formData.title ? formData.title : "",
        description: formData.description ? formData.description : "",
        deadlineTime: formData.deadlineTime
            ? Number(formData.deadlineTime)
            : Number(-1),
        targetAmount: formData.targetAmount
            ? ethers.parseUnits(formData.targetAmount, "wei")
            : ethers.parseUnits("0", "wei"),
        tags: formData.tags ? formData.tags.split(",") : [],
    };
};

const fileSchema = object()
    .shape({
        mimetype: string()
            .required("Mimetype is required")
            .oneOf(ALLOWED_EXTENSIONS, "Invalid file type"),
        filepath: string().required("Filepath is required"),
        newFilename: string().required("New filename is required"),
    })
    .noUnknown();

export const validateNewDream = object()
    .shape({
        title: string().required().min(5).max(50),
        description: string().required().min(20).max(500),
        tags: array()
            .of(string().oneOf(TAGS).required())
            .min(1, "At least one tag is required")
            .max(5, "Maximum 5 tags are allowed")
            .required("Tags are required"),
        files: array()
            .test("files-validation", "Files validation failed", (value) => {
                if (value && value.length > 5) {
                    throw new ValidationError(
                        "Files array cannot contain more than 5 items",
                        value,
                        "files"
                    );
                }
                return true;
            })
            .of(fileSchema),
        deadlineTime: number()
            .required()
            .test("is-valid-deadline", "Invalid deadline time", (value) => {
                const secondTime = Math.ceil(Date.now() / 1000) + min1;
                const time = Number(value);
                return time > secondTime;
            }),
        targetAmount: mixed()
            .required()
            .test(
                "is-valid-target-amount",
                "Invalid target amount",
                (value) => {
                    if (typeof value !== "bigint") {
                        return false;
                    }
                    return value > BigInt(0);
                }
            ),
    })
    .noUnknown();
