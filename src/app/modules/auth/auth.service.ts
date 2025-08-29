import  bcryptjs  from 'bcryptjs';
import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { ActiveStatus, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateJwtToken, verifyJwtToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import {
  createUserTokens,
  createUserWithRefreshToken,
} from "../../utils/userTokens";

const loginwithEmailAndPassword = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "incorrect password");
  }

  // const jwtPayload = {
  //     userId :isUserExist._id,
  //     email:isUserExist.email,
  //     role:isUserExist.role
  // }

  // const accessToken = generateJwtToken(
  //   jwtPayload,
  //   envVars.jwtSecret,
  //   envVars.jwtExpiredIn
  // );
  // console.log(accessToken);
  // const refreshToken = generateJwtToken(
  //   jwtPayload,
  //   envVars.jwtRefreshSecret,
  //   envVars.jwtRefreshExpiredIn
  // );
  const { accessToken, refreshToken } = createUserTokens(isUserExist);

  const { password: pass, ...userInfo } = isUserExist.toObject();
  return {
    accessToken,
    refreshToken,
    user: userInfo,
  };
};
const getNewAccessToken = async (refreshTokens: string) => {
  const newAccessToken = await createUserWithRefreshToken(refreshTokens);

  return {
    accessToken: newAccessToken.accessToken,
  };
};

//password reset function
const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId);
  console.log('user from auth service resetPassword', user);
  const isOldPasswordMatched = await bcryptjs.compare(oldPassword, user!.password as string);
  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect");
  }
  user!.password = await bcryptjs.hash(newPassword, Number(envVars.bcryptSaltRounds));
  user!.save();

}

export const authService = {
  loginwithEmailAndPassword,
  getNewAccessToken,
  resetPassword

};