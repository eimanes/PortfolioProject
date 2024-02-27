import { Strategy as OAuth2Strategy } from "passport-google-oauth20";
import userdb from "../models/User.js";
import dotenv from 'dotenv';

dotenv.config();

const googleStrategy = new OAuth2Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ["profile", "email"],
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userdb.findOne({ googleId: profile.id });

      if (!user) {
        user = new userdb({
          userId: profile.id,
          googleId: profile.id,
          firstName: profile.displayName[0].value,
          lastName: profile.displayName[1].value,
          email: profile.emails[0].value,
          picturePath: profile.photos[0].value,
        });

        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
);

export { googleStrategy };