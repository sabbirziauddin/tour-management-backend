import { verifyJwtToken } from "./../../utils/jwt";
import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import AppError from "../../errorHelpers/AppError";
import jwt from "jsonwebtoken";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();
router.post("/login", authController.loginwithCredentials);
router.post("/refresh-token", authController.getNewAccessToken);
router.post("/logout", authController.logoutUser);
router.post("/reset-password", checkAuthentication(...Object.values(Role)), authController.resetPassword);

// Google OAuth Routes
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirectUrl = req.query.redirect as string || '/';
    passport.authenticate('google', { scope: ['profile', 'email'], state: redirectUrl as string })(req, res, next);

});
// api/v1/auth/google/callback?redirect=/booking

router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/login' }), authController.googleCallbackController);


export const AuthRoutes = router;
