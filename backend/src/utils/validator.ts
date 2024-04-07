import yup, { string, number, object, array, mixed } from "yup";
import { TAGS } from "./constants";

const min1 = 60;
const h1 = min1 * 60
const d1 = h1 * 24;
const m1 = d1 * 30;
const y1 = m1 * 12;

export const parseFormData = (formData: {
    title?: string 
    description?: string;
    deadlineTime?: string;
    targetAmount?: string;
    minFundingAmount?: string;
}) => {
    return {
        title: formData.title ? formData.title : '',
        description: formData.description ? formData.description : '',
        deadlineTime: formData.deadlineTime ? Number(formData.deadlineTime) : Number(-1),
        targetAmount: formData.targetAmount ? BigInt(formData.targetAmount) : BigInt(-1),
        minFundingAmount: formData.minFundingAmount ? BigInt(formData.minFundingAmount) : BigInt(-1)
    };
};

export const validateNewDream = object().shape({
    title: string().required().min(5).max(50),
    description: string().required().min(20).max(500),
    deadlineTime: mixed().required().test('is-valid-deadline', 'Invalid deadline time', (value) => {
        const secondTime = Math.ceil(Date.now() / 1000) + min1;
        const time = Number(value);
        console.table({ secondTime, time});
        return time > secondTime;
    }),
    targetAmount: mixed().required().test('is-valid-target-amount', 'Invalid target amount', (value) => {
        if (typeof value !== 'bigint') {
            return false;
        }
        return value > BigInt(0);
    }),
    minFundingAmount: mixed().required().test('is-valid-min-funding-amount', 'Invalid minimum funding amount', (value) => {
        if (typeof value !== 'bigint') {
            return false;
        }
        return value >= BigInt(0);
    })
});


