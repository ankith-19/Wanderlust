const mysql = require("mysql2");
const flash = require("connect-flash");

const connection = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    database : 'wanderlust',
    password : 'PRUven2911??'
});

module.exports.isLoggedin = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please Login");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }else {
        res.locals.redirectUrl = "/listings";
    }
    next();
}

module.exports.isOwner = (req,res,next) => {
    let {id} = req.params;
    let q = `SELECT * FROM listing WHERE id = "${id}"`;
    let userid = req.user.id;
    connection.query(q, (err,result) => {
        console.log(err);
        console.log(result);
        let listing = result[0];
        if(!(listing.ownerid === userid)) {
            req.flash("error","Oops! You can only delete listings that you own.");
            return res.redirect(`/listings/${id}`);
        }else {
            next();
        }    
    })
}

module.exports.isReviewAuthor = (req,res,next) => {
    let {id,r_id} = req.params;
    let q = `SELECT * FROM Review WHERE r_id = "${r_id}"`;
    let authorid = req.user.id;
    connection.query(q, (err,result) => {
        console.log(err);
        console.log(result);
        let review = result[0];
        if(!(review.userid === authorid)) {
            req.flash("error","Oops! You can only delete reviews that you have posted.");
            return res.redirect(`/listings/${id}`);
        }else {
            next();
        }    
    })
}