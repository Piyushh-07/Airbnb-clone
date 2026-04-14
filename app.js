const express = require("express")
const app = express();
const mongoose = require("mongoose");
const Listing = require("./model/listings.js")
const path=require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema } = require("./schema.js")
const Review = require("./model/review.js")



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main()
.then(()=>{
    console.log("connect to the database")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL)
}


app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname,"public")))

app.get("/",(req,res)=>{
    res.send("hii i am root")
})

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError("Invalid listing data", 400);
    }else {
    next();
    }
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError("Invalid review data", 400);
    } else {
        next();
    }
};



//index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { listings: allListings });
});



//new routee of get 
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})


//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews"); // if you want reviews populated
  res.render("listings/show.ejs", { listing });
});




//create route
app.post("/listings", 
    validateListing, 
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);


//edit route
    app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let{id} = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
})
);


//update route
app.put("/listings/:id", wrapAsync (async(req, res) => {
    let { id } = req.params;
    let data = req.body.listing;

    data.price = Number(data.price) || 0;

    const listing = await Listing.findByIdAndUpdate(id, data, { new: true });
    res.redirect(`/listings/${listing._id}`);
})
);

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}))

const adminpage =wrapAsync((req,res,next)=>{
    if(req.query.token === "12345"){
        next();
    }else{
        throw new ExpressError("access denied", 403);
    }
})
app.get("/secret",adminpage,(req,res)=>{
    res.send("admin page will be here")
})

//Reviews
//Post Route
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    console.log("new review was added");
    res.send("review added successfully");

    res.redirect(`/listings/${listing._id}`);

    
})
);



app.get("/err", (req, res) => {
    throw new Error("Test error");
});

app.use((err, req, res, next) => {
    console.log("-----ERROR-----");
    next(err);
});

// app.use((req, res) => {
//     res.status(404).send("Page not found");
// });


// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My beautiful villa",
//         description:"This is a beautiful villa located in the heart of the city. It has 4 bedrooms, 3 bathrooms, and a spacious living room. The villa also features a private pool and a large garden.",
//         price:1700,
//         location:"goa",
//         country:"India",
// });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sucessfull testing");
// });

app.all(/.*/, (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})