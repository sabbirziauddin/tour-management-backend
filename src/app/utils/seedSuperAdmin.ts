import { envVars } from "../config/env";
import { IAuthType, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await User.findOne({ email: envVars.superAdminEmail });
        if (isSuperAdminExists) {
            console.log("Super Admin already exists.");
            return;
        }
        console.log("Trying to create Seeding Super Admin...");
        const hashedPassword = await bcrypt.hash(
          envVars.superAdminPassword,
          Number(envVars.bcryptSaltRounds)
        );
        const authProvider:IAuthType = {
            provider: "credentials",
            providerId: envVars.superAdminEmail,
        };
        const payload :IUser = {
          name: "Super Admin",
          email: envVars.superAdminEmail,
          password:hashedPassword ,
          role: Role.SUPER_ADMIN,
          isVerified:true,
          auths: [authProvider],
        };
        const superAdmin =await User.create(payload)   
        console.log(`Super Admin created with email: ${superAdmin.email}\n`);
        console.log(superAdmin);
        
    } catch (error) {
        console.error("Error seeding super admin:", error); 
        
    }
}