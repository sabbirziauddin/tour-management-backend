import { verifyJwtToken } from "./../../utils/jwt";
import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import AppError from "../../errorHelpers/AppError";
import jwt from "jsonwebtoken";

const router = Router();
router.post("/login", authController.loginwithCredentials);
router.post("/refresh-token", authController.getNewAccessToken);
export const AuthRoutes = router;
