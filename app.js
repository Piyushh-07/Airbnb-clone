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
const { reviewSchema } = require("./schema.js")

const listingsRoutes = require("./routes/listings.js")
const reviewsRoutes = require("./routes/review.js")



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



app.use("/listings", listingsRoutes)
app.use("/listings/:id/reviews", reviewsRoutes)


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