import { verifyJwtToken } from "./../../utils/jwt";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { model } from "mongoose";
import { User } from "./user.model";
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new Error("Error ");
//     // throw new AppError(httpStatus.BAD_REQUEST, "somthin went wrong");
//     const user = await UserServices.createUserIntoDb(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User created successfully",
//       user: user,
//     });
//   } catch (err: any) {
//     next(err);
//   }
// };
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUserIntoDb(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);
// update user
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifyToken = verifyJwtToken(token as string, envVars.jwtSecret);
    const verifedToken = req.user;
    const payload = req.body;
    const decodedToken = verifedToken as JwtPayload;

    const user = await UserServices.updatUserintoDb(
      userId,
      payload,
      decodedToken
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User updated successfully",
      data: user,
    });
  }
);

//get all user
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.getAllUsersFromDb();
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "user fetch successfully",
      data: user,
    });
  }
);
// const getAllUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = await UserServices.getAllUsersFromDb();
//     res.status(httpStatus.ACCEPTED).json({
//       success:true,
//       message: 'user fetch successfully',
//       user
//     })

//   } catch (error) {
//     next(error)

//   }
// };

export const userController = {
  createUser,
  getAllUser,
  updateUser,
};
