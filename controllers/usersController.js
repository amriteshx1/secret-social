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

exports.getHomepage = async(req, res) => {
    const messages = await db.getAllMessages(); 
    res.render('index', {title: 'Home', user: req.user, messages});
}

exports.getSignUp = (req,res) => {
    res.render('signup', {title : 'Sign Up', errors: []});
}

exports.postSignUp = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("signup", {
              title: "SignUp",
              errors: errors.array(),
            });
          }

        const password = await bcrypt.hash(req.body.password, 10);
        const { firstname, lastname, username, isadmin} = req.body;
        await db.insertNewUser(firstname, lastname, username, password);
        
        if(req.body.isadmin == "yes"){
          await db.makeAdmin(username);
        }

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

exports.getCreate = (req,res) => {
  res.render("createmsg", {title: 'Create'});
}

exports.postCreate = async(req,res) => {
  const { title, text } = req.body;
  const author = req.user.username;
  await db.createMessage(title, text, author);
  res.redirect("/");
}

exports.getMessages = async(req, res) => {
  const messages = await db.getAllMessages();
  res.render("messages", { title: "Messages", messages, user: req.user });
}

exports.getDelete = async (req, res) => {
  const id = req.params.id;
  await db.deleteMsg(id);
  res.redirect("/messages");
}