import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { ActiveStatus, IUser } from "../modules/user/user.interface";
import { generateJwtToken, verifyJwtToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateJwtToken(
    jwtPayload,
    envVars.jwtSecret,
    envVars.jwtExpiredIn
  );
  console.log(accessToken);
  const refreshToken = generateJwtToken(
    jwtPayload,
    envVars.jwtRefreshSecret,
    envVars.jwtRefreshExpiredIn
  );
  return {
    accessToken,
    refreshToken,
  };
};
export const createUserWithRefreshToken = async (refreshToken: string) => {
  const veriedRefreshToken = verifyJwtToken(
    refreshToken,
    envVars.jwtRefreshSecret
  ) as JwtPayload;
  const isUserExist = await User.findOne({
    email: veriedRefreshToken.email,
  });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "user does not exist");
  }
  if (
    isUserExist.isActive === ActiveStatus.BLOCKED ||
    isUserExist.isActive === ActiveStatus.INACTIVE
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to access this route"
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to access this route"
    );
  }
  const JwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateJwtToken(
    JwtPayload,
    envVars.jwtSecret,
    envVars.jwtExpiredIn
  );
  return {
    accessToken,
  };
};
