import { Strategy } from 'passport-google-oauth20';
import passport from 'passport';

const passportConfig = () => {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    if (clientID && clientSecret && callbackURL) {

        passport.use(
            new Strategy({
                clientID,
                clientSecret,
                callbackURL,
                scope: ['profile', 'email']
            },
                (accessToken, refreshToken, profile, done) => {
                    console.log(profile);
                    done(null, profile);
                }
            ))

        passport.serializeUser((user, done) => done(null, user))

        passport.deserializeUser((user: Express.User, done) => done(null, user))

    } else throw new Error('Google OAuth .env config is missing')
}

export default passportConfig;