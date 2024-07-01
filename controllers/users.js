const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const ExpressError = require("../utils/ExpressError.js");
const mysql = require("mysql2");
const flash = require("connect-flash");
const {saveredirectUrl} = require("../middleware.js");

const connection = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    database : 'wanderlust',
    password : 'PRUven2911??'
});

module.exports.renderSignupFrom = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    let id = uuidv4();
    if(password.length<=6) {
        req.flash("error","Password is too short");
        return res.redirect("/signup");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let q =`INSERT INTO users (id, username, email, password) VALUES  ("${id}","${username}","${email}", "${hashedPassword}")`;
    connection.query(q, (err,result) => {
        console.log(err);
        console.log(result);
        req.flash("success","Succesfully registered, Please Login.");
        res.redirect("/login");
    });
};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login =  (req,res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl;
    res.redirect(redirectUrl);
};

module.exports.logout =  (req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
};