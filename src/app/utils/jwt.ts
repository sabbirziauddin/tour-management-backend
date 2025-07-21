import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken";

export const generateJwtToken = (payload: JwtPayload, secret: string, expiredIn: string) => {
    const accessToken = jwt.sign(payload, secret, expiredIn as SignOptions);
    return accessToken;
}

export const verifyJwtToken = (token: string, secret: string) => {
    const verifyToken = jwt.verify(token, secret)
    return verifyToken;

   

}