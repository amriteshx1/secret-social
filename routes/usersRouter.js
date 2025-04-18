const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.getHomepage);
usersRouter.get("/signup", usersController.getSignUp);
usersRouter.post("/signup", usersController.postSignUp);
usersRouter.get("/login", usersController.getLogin);
usersRouter.post("/login", usersController.postLogin);
usersRouter.get("/logout", usersController.getLogout);
usersRouter.get("/membership", usersController.getMembership);
usersRouter.post("/membership/secret", usersController.postSecret);
usersRouter.get("/create", usersController.getCreate);
usersRouter.post("/create/message", usersController.postCreate);
usersRouter.get("/messages", usersController.getMessages);

module.exports = usersRouter;
