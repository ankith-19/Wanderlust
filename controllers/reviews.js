const mysql = require("mysql2");
const ExpressError = require("../utils/ExpressError.js");
const { v4: uuidv4 } = require('uuid');
const {isLoggedin} = require("../middleware.js");
const {isReviewAuthor} = require("../middleware.js");

const connection = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    database : 'wanderlust',
    password : 'PRUven2911??'
});

module.exports.createReview = (req,res) => {
    let {id} = req.params;
    let{rating,comment} = req.body;
    let r_id = uuidv4();
    let userid = req.user.id;
    let username = req.user.username;

    let q = `INSERT INTO Review(r_id,comment,rating,list_id,userid,username) VALUES("${r_id}","${comment}",${rating},"${id}","${userid}","${username}")`;
    connection.query(q,(err,result) => {
        console.log(err);
        console.log(result);
        req.flash("success",`Thank you ${username} for your review. Your feedback is valuable to us.`);
        res.redirect(`/listings/${id}`);
    })
};

module.exports.destroyReview = (req,res)=> {
    let {id,r_id} = req.params;
    let q = `DELETE FROM Review WHERE r_id = "${r_id}"`;
    connection.query(q,(err,result) => {
        console.log(err);
        console.log(result);
        req.flash("success","Review Deleted.");
        res.redirect(`/listings/${id}`);
    })
};