import yup, { string, number, object, array } from 'yup';

export const validateEmail = () => string().email().required();
export const validateEmailCode = () =>
  number().required().min(100000).max(999999);
export const validateObjectifId = () =>
  string()
    .required()
    .length(24)
    .matches(/^[0-9a-fA-F]{24}$/);
export const validateCreateUser = () =>
  object()
    .shape({
      username: string().required().min(2).max(20),
      email: string().required().email(),
      password: string().required().min(7),
    })
    .noUnknown(true);

export const validateLogUser = () =>
  object()
    .shape({
      email: string().required().email(),
      password: string().required().min(7),
    })
    .noUnknown(true);
