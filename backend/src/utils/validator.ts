import { string, number, object, array, ValidationError } from "yup";
import { ALLOWED_EXTENSIONS, LIMITS, TAGS } from "./constants";
import { ethers } from "ethers";

const min1 = 60;

export const validateEthAddress = string()
    .required()
    .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

export const validateObjectId = object().shape({
    id: string()
        .required()
        .length(24)
        .matches(/^[0-9a-fA-F]{24}$/),
});

export const validateWithdraw = object().shape({
    amount: string().matches(/^[1-9][0-9]*$/, "Invalid amount"),
    to: validateEthAddress,
});

export const validateVerifyEcRecoverChallenge = object()
    .shape({
        address: validateEthAddress,
        signature: string().required(),
    })
    .noUnknown();

export const validateEditDream = object()
    .shape({
        title: string().min(LIMITS.dreamTitle.min).max(LIMITS.dreamTitle.max),
        description: string()
            .min(LIMITS.dreamDescription.min)
            .max(LIMITS.dreamDescription.max),
        tags: array()
            .of(string().oneOf(TAGS).required())
            .min(LIMITS.dreamTags.min, "At least one tag is required")
            .max(LIMITS.dreamTags.max, "Maximum 5 tags are allowed"),
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
        targetAmount: formData.targetAmount || "0",
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
        title: string()
            .required()
            .min(LIMITS.dreamTitle.min)
            .max(LIMITS.dreamTitle.max),
        description: string()
            .required()
            .min(LIMITS.dreamDescription.min)
            .max(LIMITS.dreamDescription.max),
        tags: array()
            .of(string().oneOf(TAGS).required())
            .min(LIMITS.dreamTags.min, "At least one tag is required")
            .max(LIMITS.dreamTags.max, "Maximum 5 tags are allowed")
            .required("Tags are required"),
        files: array()
            .test("files-validation", "Files validation failed", (value) => {
                if (value && value.length > LIMITS.files.max) {
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
        targetAmount: string()
            .required()
            .matches(/^[1-9][0-9]*$/, "Invalid target amount")
            .test("is-valid-amount", "Invalid target amount", (value) => {
                return ethers.parseEther(value) > ethers.parseUnits("1", "wei");
            }),
    })
    .noUnknown();
