import { Types } from "mongoose";

export  enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}
export  enum ActiveStatus {
    ACTIVE = "ACTIVE",  
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
    PENDING = "PENDING",
}
export interface IAuthType {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
    name:string,
    email:string,
    password?: string,
    phone?:string,
    picture?:string,
    address?:string,
    isDeleted?:boolean,
    isVerified?:boolean,
    role?:Role,
    isActive?:ActiveStatus,
    auths?:IAuthType[],
    bookings ?:Types.ObjectId[],
    guides?:Types.ObjectId[],
    createdAt?:Date,
    updatedAt?:Date,
    _id?: Types.ObjectId,           
}