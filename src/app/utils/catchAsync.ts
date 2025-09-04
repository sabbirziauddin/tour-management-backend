import { NextFunction, Request, RequestHandler, Response } from "express"
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export const catchAsync = (fn: AsyncHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            next(err)

        })
    }

}