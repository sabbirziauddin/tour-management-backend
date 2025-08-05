import { NextFunction, Request, Response } from "express";
import { userRoutes } from "./app/modules/user/user.route";
import cors from "cors";
import passport from "passport";
import express from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErroHandlers";
import { NotFound } from "./app/middlewares/NotFound";
import cookieParser from "cookie-parser";
import { Passport } from "passport";
import expressSession from "express-session";
import './app/config/passport'; 

let app = express();
app.use(expressSession({
  secret: "passport-secret",
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Define the root route FIRST
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Hello World from tour management backend!",
  });
});
app.use("/api/v1", router);

//global error hanller
app.use(globalErrorHandler);
app.use(NotFound);

export default app;
