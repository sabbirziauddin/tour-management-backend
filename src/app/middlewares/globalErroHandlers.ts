import { envVars } from './../config/env';
import { NextFunction, Request, Response } from "express";

export const  globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
     const statusCode = err.statusCode || 500;
     const message = err.message || "Internal Server Error";
  
  if (envVars.nodeEnv === "development"){

    res.status(err.httpStatus || 500).json({
      status: "error",
      message: `something went wrong ${err.message}||internal server error from global error`,
      stack: err.stack,
    });
  }else{
     res.status(statusCode).json({
       status: "error",
       message: null, // Only show user-friendly message
     });
  }
    
}

