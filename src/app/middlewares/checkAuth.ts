import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyJwtToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { ActiveStatus } from '../modules/user/user.interface';

export const checkAuthentication =
  (...authRole: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(401, "Access token is required");
      }
      const verifedToken = verifyJwtToken(
        accessToken,
        envVars.jwtSecret
      ) as JwtPayload;
      console.log("from checkAuth middleware:", verifedToken);
      const isUserExist = await User.findOne({ email: verifedToken.email });
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "user does not exist");
      }
      if (isUserExist.isActive === ActiveStatus.BLOCKED || isUserExist.isActive === ActiveStatus.INACTIVE) {
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
      if (!authRole.includes(verifedToken.role)) {
        throw new AppError(
          403,
          "Forbidden: You do not have permission to access this resource"
        );
      }
      if (!verifedToken) {
        throw new AppError(401, "Invalid access token");
      }
      req.user = verifedToken;
      next();
    } catch (error) {
      next(error);
    }
  };