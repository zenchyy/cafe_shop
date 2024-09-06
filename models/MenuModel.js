const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        index: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

MenuSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.price = Number(doc.price.toString()).toFixed(2);
    }
})

const Menu = mongoose.model("menus", MenuSchema);

module.exports = Menu;


