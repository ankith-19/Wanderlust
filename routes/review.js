const express = require("express");
const router = express.Router({mergeParams: true});
const mysql = require("mysql2");
const ExpressError = require("../utils/ExpressError.js");
const { v4: uuidv4 } = require('uuid');
const {isLoggedin} = require("../middleware.js");
const {isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");



const connection = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    database : 'wanderlust',
    password : 'PRUven2911??'
});

//Middleware for validating reviews
const validateReview = (req,res,next) => {
    let {rating,comment} = req.body;
    if(!comment) {
        return next(new ExpressError(401,"Comment is missing."));
    }else if(rating<1 || rating>5) {
        return next(new ExpressError(401,"Rating should be between 1 to 5"));
    }else {
        next();
    }
}

// //Middleware for Delteing Reviews When Lisitng is Deleted 
// const delReview = (req,res,next) => {
//     let {id} = req.params;
//     q = `DELETE FROM Review WHERE list_id = "${id}"`;
//     connection.query(q,(err,result) => {
//         console.log(err);
//         console.log(result);
//     })
//     next();
// }


//Create Review Route
router.post("/",isLoggedin,validateReview,reviewController.createReview);


//Delete Review Route
router.delete("/:r_id",isLoggedin,isReviewAuthor,reviewController.destroyReview);

module.exports = router;