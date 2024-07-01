const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const mysql = require("mysql2");
const { route } = require("./listing");
const passport = require("passport");
const flash = require("connect-flash");
const {saveredirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

const connection = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    database : 'wanderlust',
    password : 'PRUven2911??'
});


//SignUp Form Route
router.get("/signup",userController.renderSignupFrom);

//SignUp Route
router.post('/signup', wrapAsync(userController.signup));

//Login form Route
router.get("/login", userController.renderLoginForm);

//Login Route
router.post("/login", saveredirectUrl, passport.authenticate("local", {failureRedirect: "/login",failureFlash: true}),userController.login);

//Logout Route
router.get("/logout",userController.logout);

module.exports = router;