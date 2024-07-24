const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//Requiring routes using express router object
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");

const port = proces.env.PORT || 3000;

const connection = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    database : 'wanderlust',
    password : 'PRUven2911??'
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
    let q = `SELECT * FROM users WHERE username = "${username}"`;
    connection.query(q, (err, results) => {
        if (err) {
        return done(err);
        }
        if (results.length === 0) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    let q = `SELECT * FROM users WHERE id = "${id}"`;
    connection.query(q, (err, results) => {
        if (err) return done(err);
        done(null, results[0]);
    });
});

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);

//All invalid Routes
app.all("*", (req,res,next) => {
    next(new ExpressError(400,"Page not Found"));
})

//Error Handling Middleware
app.use((err,req,res,next) => {
    let {statusCode=500,message="Something Went Wrong"} = err;
    res.render("listings/error.ejs", {message});
})
