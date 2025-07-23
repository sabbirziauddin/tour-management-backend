import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyJwtToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuthentication =
  (...authRole: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(401, "Access token is required");
      }
      const verifedToken = verifyJwtToken(
        accessToken,
        envVars.jwtSecret
      ) as JwtPayload;
      console.log(verifedToken);
      if (!authRole.includes(verifedToken.role)) {
        throw new AppError(
          403,
          "Forbidden: You do not have permission to access this resource"
        );
      }
      if (!verifedToken) {
        throw new AppError(401, "Invalid access token");
      }
      next();
    } catch (error) {
      next(error);
    }
  };