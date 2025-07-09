import { Request, Response } from "express";

const express = require("express");

let app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from tour management backend !");
});

export default app;
