import dotenv from "dotenv";

dotenv.config();
interface IEnvVars {
    port: string | number;
    dbUrl: string;
    nodeEnv: string;
}

const loadEnvVars = (): IEnvVars => {
    const requiredEnvVars:string[] = [ "PORT", "DB_URL", "NODE_ENV" ];
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Environment variable ${envVar} is not set`);
        }
    });

    return {
      port: process.env.PORT || 4000,
      dbUrl: process.env.DB_URL as string,
      nodeEnv: process.env.NODE_ENV || "development",
    };

}

export const envVars = loadEnvVars();
 
