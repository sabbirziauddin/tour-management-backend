import  passport  from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { envVars } from './env';
import { User } from '../modules/user/user.model';
import { Role } from '../modules/user/user.interface';

passport.use(
    new GoogleStrategy({
        clientID:envVars.googleClientId,
        clientSecret: envVars.googleClientSecret,
        callbackURL: envVars.googleCallbackUrl,
    },
    async(accessToken:string, refreshToken:string,profile:Profile,done:VerifyCallback)=>{
        try {
            const email = profile.emails?.[0].value;
            if (!email){
                return done(null, false, { message:"No email found in profile" });
            }
            let user = await User.findOne({email});
            if (!user) {
                user = await User.create({
                    email,
                    name: profile.displayName || 'No Name',
                    googleId: profile.id,
                    picture:profile.photos?.[0].value || '',
                    role:Role.USER,
                    isVerified: true,
                    auths:[
                        {
                            provider: 'google',
                            providerId: profile.id,
                        }
                    ]


                });
            }
            return done(null, user);

            
        } catch (error) {
            console.log("Google strategy Error",error);
            return done(error, false, { message: "Internal server error" });
            
        }
    }
   )
)
// frontend localhost:5173/login?redirect=/booking -> localhost:5000/api/v1/auth/google?redirect=/booking -> passport -> Google OAuth Consent -> gmail login -> successful -> callback url localhost:5000/api/v1/auth/google/callback -> db store -> token

// Bridge == Google -> user db store -> token
//Custom -> email , password, role : USER, name... -> registration -> DB -> 1 User create
//Google -> req -> google -> successful : Jwt Token : Role , email -> DB - Store -> token - api access

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            return done(new Error('User not found'), null);
        }
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error, null);
    }
});


// passport.authenticate('google', { scope: ['profile', 'email'] }) -> redirect to google consent page
// passport.authenticate('google', { failureRedirect: '/login' }) -> callback url -> passport.      authenticate -> done -> user -> jwt token -> redirect to frontend with token