const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../model/listings.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")

const listingController = require("../controllers/listings.js")



router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    validateListing, 
    wrapAsync(listingController.createListing)
);



//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);



router.route("/:id")
.post(
    isLoggedIn,
    validateListing, 
    wrapAsync(listingController.createListing)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
)
.get(listingController.showListing )
.put(
    isLoggedIn,
    isOwner,
    validateListing, 
    wrapAsync(listingController.updateListing)
);




//edit route
    router.get("/:id/edit",
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.renderEditForm));





// const adminpage =wrapAsync((req,res,next)=>{
//     if(req.query.token === "12345"){
//         next();
//     }else{
//         throw new ExpressError("access denied", 403);
//     }
// })
// app.get("/secret",adminpage,(req,res)=>{
//     res.send("admin page will be here")
// })


module.exports = router;