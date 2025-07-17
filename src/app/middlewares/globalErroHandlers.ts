import AppError from "../errorHelpers/AppError";
import { envVars } from "./../config/env";
import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = err.message || "Internal Server Error";
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  if (envVars.nodeEnv === "development") {
    res.status(statusCode).json({
      status: "error",
      message: `something went wrong ${err.message}`,
      stack: err.stack,
    });
  } else {
    res.status(statusCode).json({
      status: "error",
      message: null, // Only show user-friendly message
    });
  }
};
