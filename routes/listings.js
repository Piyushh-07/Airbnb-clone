const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../model/listings.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")

const listingController = require("../controllers/listings.js")




//index Route
router.get("/",wrapAsync(listingController.index));



//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);


//show route
router.get("/:id",listingController.showListing );




//create route
router.post("/", 
    isLoggedIn,
    validateListing, 
    wrapAsync(listingController.createListing)
);


//edit route
    router.get("/:id/edit",
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.renderEditForm));


//update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync (async(req, res) => {
    let { id } = req.params;
    let data = req.body.listing;

    data.price = Number(data.price) || 0;

    const listing = await Listing.findByIdAndUpdate(id, data, { new: true });
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${listing._id}`);
})
);

//delete route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    console.log(deletedListing);
    res.redirect("/listings")
}))

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