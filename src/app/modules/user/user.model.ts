import mongoose, { model } from "mongoose";
import { ActiveStatus, IUser, Role } from "./user.interface";

const authProviderSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: true,
        trim: true,
    },
    providerId: {
        type: String,
        required: true,
        trim: true,
    }   
},{
    _id: false,
    versionKey: false,
})
const userSchema = new mongoose.Schema<IUser>({
    name:{
        type:String,
        required: true,
        trim: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
        trim: true,
    },
    password:{
        type:String,
        
    },
    role:{
        type:String,
        enum:Object.values(Role),
        default: Role.USER,
    },
    phone:{
        type:String,
        trim: true,
    },
    picture:{
        type:String,
        trim: true,
    },
    address:{
        type:String,
        trim: true,
    },
    isDeleted:{
        type:Boolean,
        default: false, // Soft delete
    },
    isVerified:{
        type:Boolean,
        default: false, // Initially not verified
    },
    isActive:{
        type:String,
        enum:Object.values(ActiveStatus),
        default: ActiveStatus.ACTIVE,
    },
    auths:[authProviderSchema],

},{
    timestamps: true,
    versionKey: false,
})

export const User = model<IUser>("User", userSchema); 