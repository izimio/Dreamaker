import yup, { string, number, object, array } from 'yup';
import { TAGS } from './constants';
const min1 = 60 * 60;
const d1 = min1 * 24; 
const m1 = d1 * 30;
const y1 = m1 * 12;

export const validateCreateDream = yup.object({
  title: string().required().min(3),
  description: string().required().min(3),
  tags: array().of(string().oneOf(TAGS)).required(),
  deadlineTime: number().required().min((Date.now() / 1000) + d1),
  targetAmount: number().required().min(1),
});