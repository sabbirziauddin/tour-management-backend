import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import AppError from "../../errorHelpers/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { Role } from "./user.interface";
import { verifyJwtToken } from "../../utils/jwt";
import { checkAuthentication } from "../../middlewares/checkAuth";
import { object } from "zod";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);
router.get(
  "/allusers",
  checkAuthentication(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUser
);
router.patch(
  "/:id",
  checkAuthentication(...Object.values(Role)),
  userController.updateUser
);

export const userRoutes = router;
