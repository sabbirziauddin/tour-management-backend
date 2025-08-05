import { JwtPayload } from 'jsonwebtoken';
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from '../../utils/userTokens';

const loginwithCredentials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authService.loginwithEmailAndPassword(req.body);
    //set cookies for access and refresh tokens
    setAuthCookie(res, loginInfo);

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
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "login successfully",
      data: tokenInfo,
    });
  }
);
const logoutUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax", // Best practice for security
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "logged out  successfully",
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    await authService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);


    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "password reset successfully",
      data: null,
    });
  }
);
//for google callback controller
// This function handles the callback from Google OAuth after user authentication
// It retrieves the user information and sets the access and refresh tokens in cookies.
// Finally, it redirects the user to the specified URL or home page.

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;
    console.log("user in google callback form auth controller", user);
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }
    //set cookies for access and refresh tokens
    const tokenInfo = createUserTokens(user);
    setAuthCookie(res, tokenInfo);
    // Redirect to the original URL or home page
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1); // Remove leading slash if present
    }
    res.redirect(`${envVars.frontendUrl}/${redirectTo}`);





    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "password reset successfully",
    //   data: null,
    // });
  }
);

export const authController = {
  loginwithCredentials,
  getNewAccessToken,
  logoutUser,
  resetPassword,
  googleCallbackController
};