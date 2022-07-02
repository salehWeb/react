import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import dotenv from 'dotenv';
dotenv.config();
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
    passReqToCallback: true
},
    function (request: any, accessToken: string, refreshToken: string, profile: any, done: any) {
        // some database logic 
        return done(null, profile);
    }
));


passport.serializeUser(function (user: any, done: any) {
    done(null, user);
})

passport.deserializeUser(function (user: any, done: any) {
    done(null, user);
})