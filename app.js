// app.js
const express = require("express");
const app = express();
const usersRouter = require("./routes/usersRouter");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./config/passportConfig");

initializePassport(passport);

app.use(
    session({
      secret: "cats",
      resave: false,
      saveUninitialized: false,
    })
  );

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", usersRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));

