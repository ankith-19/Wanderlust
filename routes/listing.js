const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const ExpressError = require("../utils/ExpressError.js");
const { v4: uuidv4 } = require('uuid');
const {isLoggedin} = require("../middleware.js");
const {isOwner} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const connection = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    database : 'wanderlust',
    password : 'PRUven2911??'
});


//Middleware to validate listings
const validateListing = (req,res,next) => {
    let {title:newtitle,description:newdes,image:newimg,price:newpri,location:newloc,country:newcon} = req.body;
    if(!newtitle) {
        return next(new ExpressError(401,"Please enter a title."));
    }else if(!newdes) {
        return next(new ExpressError(401,"Description is missing."));
    }else if(!newimg) {
        return next(new ExpressError(401,"Image URL is missing."));
    }else if(!newloc) {
        return next(new ExpressError(401,"Location is missing."));
    }else if(!newcon) {
        return next(new ExpressError(401,"Country is missing."));
    }else {
        next();
    }
}

//Middleware for Delteing Reviews When Lisitng is Deleted 
const delReview = (req,res,next) => {
    let {id} = req.params;
    q = `DELETE FROM Review WHERE list_id = "${id}"`;
    connection.query(q,(err,result) => {
        console.log(err);
        console.log(result);
    })
    next();
}

//Index Route
router.get("/",listingController.index);

//New Route
router.get("/new", isLoggedin, listingController.renderNewForm);

//Create Route
router.post("/", isLoggedin, validateListing, listingController.createListing);

//Edit Route
router.get("/:id/edit", isLoggedin,isOwner, listingController.renderEditForm);

//Update Route
router.put("/:id", isLoggedin, validateListing, listingController.updateListing);

//Delete Route
router.delete("/:id", isLoggedin,isOwner, delReview, listingController.destroyListing);

//Show Route
router.get("/:id", listingController.showListing);

module.exports = router;