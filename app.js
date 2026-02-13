const express = require("express")
const app = express();
const mongoose = require("mongoose");
const Listing = require("./model/listings.js")
const path=require("path")

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

app.get("/",(req,res)=>{
    res.send("hi, I am root")
})

//index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { listings: allListings });
});

//show route
app.get("/listings/:id",async(req,res)=>{
    let{id} = req.params
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", {listing});
})

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

app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})