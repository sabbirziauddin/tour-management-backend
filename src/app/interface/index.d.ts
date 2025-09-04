import { JwtPayload } from "jsonwebtoken";

declare global{
    namespace Express {
        interface Request {
            user: JwtPayload; // This will hold the verified JWT payload
            // You can add more properties if needed, e.g., roles, permissions, etc.
        }
    }
}