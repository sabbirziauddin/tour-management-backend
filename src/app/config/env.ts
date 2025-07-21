import dotenv from "dotenv";

dotenv.config();
interface IEnvVars {
  port: string | number;
  dbUrl: string;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiredIn: string;
  bcryptSaltRounds: string;
}

const loadEnvVars = (): IEnvVars => {
  const requiredEnvVars: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "JWT_SECRET",
    "JWT_EXPIRED_IN",
    "BCRYPT_SALT_ROUNDS",
  ];
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is not set`);
    }
  });

  return {
    port: process.env.PORT || 4000,
    dbUrl: process.env.DB_URL as string,
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiredIn: process.env.JWT_EXPIRED_IN as string,
    bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS || "10",
  };
};

export const envVars = loadEnvVars();
 
