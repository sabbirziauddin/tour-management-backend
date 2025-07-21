import { IAuthType, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

const createUserIntoDb = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  // Check if user already exists
  const existingUser = await User.findOne({
    email,
  });
  if (existingUser) {
    throw new Error("User already exists");
  }
  //hash password
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  //create auth provider info
  const authProvider: IAuthType = {
    provider: "credentials",
    providerId: email as string,
  };

  // Create new user
  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
    auths: [authProvider],
  });
  return user;
};
//get all users
const getAllUsersFromDb = async () => {
  const allUser = await User.find();
  return allUser;
};
export const UserServices = {
  createUserIntoDb,
  getAllUsersFromDb,
};
