import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel";
import { AuthError, ValidationError } from "../utils/error";

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    return { ok: true };
  } catch (e: any) {
    const err = e.toString();
    throw new ValidationError(
      err.includes("email")
        ? "Addresse email déjà utilisé"
        : "Nom d'utilisateur déjà utilisé"
    );
  }
};

export const setLogin = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AuthError("Mot de passe ou email incorrect");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AuthError("Mot de passe ou email incorrect");
  }
//   const challenge = await EmailChallengeModel.findOne({ email });
//   if (challenge) {
//     await challenge.remove();
//   }
//   await EmailChallengeModel.create({
//     email,
//   });

  return user;
};