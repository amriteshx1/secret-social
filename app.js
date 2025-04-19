// app.js
const express = require("express");
const app = express();
const path = require("path");
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
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use("/", usersRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));

