import  bcryptjs  from 'bcryptjs';
import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import jwt from "jsonwebtoken";
import { generateJwtToken } from '../../utils/jwt';
import { envVars } from '../../config/env';


const loginwithEmailAndPassword = async(payload:Partial<IUser>)=>{
    const {email,password} = payload;
    
    const isUserExist = await User.findOne({email});
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,'Email does not exist');
    }
   
    const isPasswordMatched = await bcryptjs.compare(password as string,isUserExist.password as string)
    
    if(!isPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST,'incorrect password')
    }

    const jwtPayload = {
        userId :isUserExist._id,
        email:isUserExist.email,
        role:isUserExist.role
    }
   
    const accessToken = generateJwtToken(
      jwtPayload,
      envVars.jwtSecret,
      envVars.jwtExpiredIn
    );
    console.log(accessToken);
    return {
        accessToken,
        user: isUserExist
    }

       






}
export const authService = {
    loginwithEmailAndPassword
}