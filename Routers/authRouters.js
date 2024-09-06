const express = require("express");

const { registerGet, loginGet, loginPost, logoutPost } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.get("/register", registerGet);

authRouter.get("/login", loginGet);

authRouter.post("/login", loginPost);

authRouter.post("/logout", logoutPost);

module.exports = authRouter;