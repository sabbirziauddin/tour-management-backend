import { verifyJwtToken } from "./../../utils/jwt";
import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import AppError from "../../errorHelpers/AppError";
import jwt from "jsonwebtoken";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();
router.post("/login", authController.loginwithCredentials);
router.post("/refresh-token", authController.getNewAccessToken);
router.post("/logout", authController.logoutUser);
router.post("/reset-password", checkAuthentication(...Object.values(Role)), authController.resetPassword);
export const AuthRoutes = router;
