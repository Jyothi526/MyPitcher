const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String,
        default: ''
    },
    saltSecret: String,
    googleid: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false
    },
    resetLink: {
        type: String,
        default: ''
    },
    accessToken: {
        type: String,
        default: ''
    }
})


//verifying the password when user enters it into the login form with password in database
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

//generating jwt token for authentication
userSchema.methods.generatedJwt = function () {
    console.log("Inside generatedJwt token")
    return jwt.sign({ _id: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        })
}


mongoose.model('user', userSchema);