import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

const loginwithCredentials =catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authService.loginwithEmailAndPassword(req.body);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:'login successfully',
        data:loginInfo
    })

})

export const authController = {
    loginwithCredentials
}