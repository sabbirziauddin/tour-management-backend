import app from "./app";
import { envVars } from "./app/config/env";

const mongoose = require("mongoose");

let server: any;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.dbUrl);
    console.log("database connected successfully");
    server = app.listen(envVars.port, () => {
      console.log(`server is running on port ${envVars.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

//unhandle exeption
process.on("uncaughtException", (error) => {
  if (server) {
    console.log("Uncaught Exception: ", error);
    process.exit(1); // Exit the process with failure
  }
  process.exit(1); // Exit the process with success
});

//Promise.reject(new Error("I forgot to catch this uncaught exception"));
process.on("unhandledRejection", (error) => {
  if (server) {
    console.log("uncaught rejection", error);
    process.exit(1);
  }
  process.exit(1);
});

//throw new Error("forgot to caught unhandle rejection");

//handle sigterm
/* process.on("SIGTERM", () => {
  if (server) {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("Process terminated");
    });
  }
}); */
//handle SIGINT
/* process.on("SIGINT", () => {
  if (server) {
    console.log("SIGINT received, shutting down gracefully");
    server.close(() => {
      console.log("Process terminated");
    });
  }
}); */
//check sigterm
/* process.on("SIGUSR2", () => {
  if (server) {
    console.log("SIGUSR2 received, shutting down gracefully");
    server.close(() => {
      console.log("Process terminated");
    });
  }
}); */
//check SIGUSR2
