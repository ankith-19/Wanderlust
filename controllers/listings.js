const mysql = require("mysql2");
const ExpressError = require("../utils/ExpressError.js");
const { v4: uuidv4 } = require('uuid');
const {isLoggedin} = require("../middleware.js");
const {isOwner} = require("../middleware.js");

const connection = mysql.createConnection( {
    host : 'localhost',
    user : 'root',
    database : 'wanderlust',
    password : 'PRUven2911??'
});

module.exports.index = (req,res) => {
    let q = 'SELECT * FROM listing'
    connection.query(q, (err,result) => {
        const allListings = result;
        res.render("listings/index.ejs", {allListings});
    });
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = (req,res,next) => {
    let {title:newtitle,description:newdes,image:newimg,price:newpri,location:newloc,country:newcon} = req.body;
    let id = uuidv4();
    let ownerid = req.user.id;
    console.log(req.user);
    
    let trimid = id.substring(0, 7);
    let q = `INSERT INTO listing(id,title,description,image,price,location,country,ownerid) VALUES ("${trimid}","${newtitle}","${newdes}","${newimg}",${newpri},"${newloc}","${newcon}","${ownerid}")`;
    connection.query(q, (err,result) =>{
        console.log(result);
        console.log(err);
    })
    req.flash("success","Yay! New listing created.");
    res.redirect("/listings");
};

module.exports.renderEditForm = (req,res,next) => {
    let {id} = req.params;
    let q = `SELECT * FROM listing WHERE id = '${id}'`;
    connection.query(q, (err,result) => {
        const listing = result[0];
        if(!listing) {
            req.flash("error","Listing you are searching for does not exist");
            res.redirect("/listings");
        }
        console.log(result);
        console.log(err);
        res.render("listings/edit.ejs",{listing});
    })
};

module.exports.updateListing = (req,res) => {
    let {id} = req.params;
    let {title,description,image,price,location,country} = req.body;
    let q = `UPDATE listing SET title='${title}',description='${description}',image='${image}',price='${price}',location='${location}',country='${country}' WHERE id = '${id}'`; 
    connection.query(q, (err,result) => {
        console.log(result);
        console.log(err);
        req.flash("success","Listing Updated.");
        res.redirect(`/listings/${id}`);
    })
};

module.exports.destroyListing = (req,res) => {
    let {id} = req.params;
    let q = `DELETE FROM listing WHERE id = '${id}'`;
    connection.query(q, (err,result) => {
        console.log(result);
        console.log(err);
        req.flash("success","Listing Deleted.");
        res.redirect("/listings");
    })
};

module.exports.showListing = (req,res,next) => {
    let {id} = req.params;
    let q = `SELECT * FROM listing WHERE id = '${id}'`;
    let j = `SELECT * FROM Review WHERE list_id = "${id}"`;
    
    let usernames = [];
    const return_data = [];

    connection.query(q, [], (err, results) => {
        if(!results[0]) {
            req.flash("error","Listing you are searching for does not exist.");
            return res.redirect("/listings");
        }
        return_data.table1 = results[0];
        console.log(results[0]);
        connection.query(j, [], (err, results) => {
            return_data.table2 = results;
            console.log(results);
            let listing = return_data.table1;
            let ownerid = listing.ownerid;
            let reviews = return_data.table2;
            let k = `SELECT * FROM users WHERE id = "${ownerid}"`;
            connection.query(k, [], (err,results) => {
                return_data.table3 = results[0];
                console.log(err);
                console.log(results);
                let owner = return_data.table3;
                res.render("listings/show.ejs",{listing,reviews,owner});
            })
        });
    })
    //Same code logic but having errors 
    // connection.query(j,(err,result) => {
    //     console.log(err);
    //     console.log(result);
    //     let reviews = result;
    // })
    // connection.query(q, (err,result) => {
    //     // console.log(result);
    //     // console.log(err);
    //     let listing = result[0];
    //     if(!listing) {
    //         next(new ExpressError(403,"Listing you are searching for does not exist."));
    //     }
    //     res.render("listings/show.ejs", {listing},{reviews} );
    // })
};