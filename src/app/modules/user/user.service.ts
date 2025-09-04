import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { IAuthType, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";

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
//update user
const updatUserintoDb = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserExists = await User.findById(userId);
  if (!ifUserExists) {
    throw new AppError(httpStatus.FORBIDDEN, "User not found");
  }
  if (payload.role === Role.USER || decodedToken.role === Role.GUIDE) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this user"
    );
  }
  if (payload.role === Role.SUPER_ADMIN && decodedToken.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update super admin"
    );
  }
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not allowed to update this user"
      );
    }
  }
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.bcryptSaltRounds)
    );
  }
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  if (!newUpdatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return newUpdatedUser;
};
//get all users
const getAllUsersFromDb = async () => {
  const allUser = await User.find();
  return allUser;
};
export const UserServices = {
  createUserIntoDb,
  getAllUsersFromDb,
  updatUserintoDb,
};
