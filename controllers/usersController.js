const { body, validationResult } = require("express-validator");
const db = require('../database/queries');
const bcrypt = require('bcryptjs');
const passport = require('passport');


const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstname").trim().notEmpty()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastname").trim().notEmpty()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body("username").trim().notEmpty()
    .isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body("password").trim().notEmpty()
  .isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  .withMessage('Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

exports.getHomepage = (req, res) => {
    res.render('index', {title: 'Home', user: req.user});
}

exports.getSignUp = (req,res) => {
    res.render('signup', {title : 'Sign Up'});
}

exports.postSignUp = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("createUser", {
              title: "Create user",
              errors: errors.array(),
            });
          }

        const password = await bcrypt.hash(req.body.password, 10);
        const { firstname, lastname, username} = req.body;
        await db.insertNewUser(firstname, lastname, username, password);
        res.redirect('/');
    }
];

exports.getLogin = (req, res) => {
  res.render('login', {title: "Login"});
}

exports.postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});

exports.getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

exports.getMembership = (req, res) => {
  res.render("secret", {title: "Secret", query: req.query})
}

exports.postSecret = async (req, res) => {
  const username = req.user.username;
  const passcode = req.body.secretpasscode;
  const user = await db.findUserByEmail(username);
  if(passcode == user.lastname){
    await db.becomeMember(username);
    
    const updatedUser = await db.findUserByEmail(username);
    req.login(updatedUser, function (err) {
      if (err) return next(err);
      return res.redirect("/");
    });
  }else {
    res.redirect("/membership?error=1");
  }
}