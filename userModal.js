const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
    {
        email: {
            type: "string",
            require: [true, "Please provide valid email"],
            unique: [true, "this email addres having already"]
        },
        passward: {
            type: "string",
            require: [true, "Please enter passward"],
            unique: false
        }
    }
)
module.exports = mongoose.model("Users", userSchema);