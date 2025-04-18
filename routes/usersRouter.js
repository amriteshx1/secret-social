const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.getHomepage);
usersRouter.get("/signup", usersController.getSignUp);
usersRouter.post("/signup", usersController.postSignUp);
usersRouter.get("/login", usersController.getLogin);
usersRouter.post("/login", usersController.postLogin);
usersRouter.get("/logout", usersController.getLogout);

module.exports = usersRouter;
