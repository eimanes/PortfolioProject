import passport from "passport";
import { googleStrategy } from "../config/googleStrategy.strategy.js";

passport.use(googleStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;