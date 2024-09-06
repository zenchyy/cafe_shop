const express = require("express");

const { userGet, userPost, getUserByID } = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/users", userPost);

userRouter.get("/users", userGet);

userRouter.get("/users/:id", getUserByID);

module.exports = userRouter;