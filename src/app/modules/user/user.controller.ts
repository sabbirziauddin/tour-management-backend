import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { model } from "mongoose";
import { User } from "./user.model";
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // throw new Error("Error ");
    // throw new AppError(httpStatus.BAD_REQUEST, "somthin went wrong");
    const user = await UserServices.createUserIntoDb(req.body);

    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      user: user,
    });
  } catch (err: any) {
    next(err);
  }
};

export const userController = {
  createUser,
};
