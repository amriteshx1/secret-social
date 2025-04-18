const LocalStrategy = require('passport-local').Strategy;
const db = require("../database/queries");
const bcrypt = require('bcryptjs');


function initialize(passport) {
    passport.use(
      new LocalStrategy(
        async (username, password, done) => {
          const user = await db.findUserByEmail(username);
          if (!user) return done(null, false, { message: "No user found" });
  
          const match = await bcrypt.compare(password, user.hashedpassword);
          if (!match) return done(null, false, { message: "Incorrect password" });
  
          return done(null, user);
        }
     )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await db.findUserById(id);
    done(null, user);
  });
}

module.exports = initialize;