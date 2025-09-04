import dotenv from "dotenv";

dotenv.config();
interface IEnvVars {
  port: string | number;
  dbUrl: string;
  nodeEnv: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiredIn: string;
  jwtExpiredIn: string;
  bcryptSaltRounds: string;
  superAdminEmail: string;
  superAdminPassword: string;
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
  expressSessionSecret: string;
  frontendUrl: string;
}

const loadEnvVars = (): IEnvVars => {
  const requiredEnvVars: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_EXPIRED_IN",
    "JWT_REFRESH_EXPIRED_IN",
    "BCRYPT_SALT_ROUNDS",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
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
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL as string,
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD as string,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
    jwtRefreshExpiredIn: process.env.JWT_REFRESH_EXPIRED_IN as string,
    googleClientId: process.env.GOOGLE_CLIENT_ID as string,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL as string,
    expressSessionSecret: process.env.EXPRESS_SESSION_SECRET as string,
    frontendUrl: process.env.FRONTEND_URL as string,
  };
};

export const envVars = loadEnvVars();
 
