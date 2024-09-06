const { User } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createToken } = require("../helpers/helpers")

module.exports.registerGet = function (req,res) {
    res.render("register", {
        page_title: "Registeration"
    });
}

module.exports.loginGet = function(req, res) {
    res.render("login", { page_title: "Sign In"});
}

module.exports.loginPost = async function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
try {
    let user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            errors: { email: "Email not found" }
        });
    }

    let check_password = await bcrypt.compare(password, user.password);
    if (!check_password) {
        return res.status(400).json({
            errors: { password: "Wrong password" }
        });
    }

    let token = createToken(user.id);
    res.cookie("_token", token, { maxAge: 1000 * 60 * 60 * 24 });
    return res.status(200).json({ data: "ok" });

} catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Server error" });
}
}

module.exports.logoutPost = function (req, res) {
    // Clear the JWT token from cookies
    res.clearCookie("_token");
    // Redirect to the login page
    return res.redirect("/login");
};