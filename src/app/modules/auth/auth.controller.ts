import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";

const loginwithCredentials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authService.loginwithEmailAndPassword(req.body);
    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure: envVars.nodeEnv === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    // Set the refresh token in a cookie
    // This is optional, you can also send it in the response body
    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: envVars.nodeEnv === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "login successfully",
      data: loginInfo,
    });
  }
);
// This function handles the refresh token logic
// It verifies the refresh token and generates a new access token
// if the user is valid and active.
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access this route"
      );
    }
    const tokenInfo = await authService.getNewAccessToken(
      refreshToken as string
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "login successfully",
      data: tokenInfo,
    });
  }
);

export const authController = {
  loginwithCredentials,
  getNewAccessToken,
};