const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, "Invalid Email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

UserSchema.pre("save", async function(next){
    let salt = await bcrypt.genSalt();
    let hashedPw = await bcrypt.hash(this.password, salt);
    this.password = hashedPw;
    next();
})

const User = mongoose.model("users", UserSchema);
module.exports.User = User;