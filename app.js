const express = require("express")
const app = express();
const mongoose = require("mongoose");
const path=require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./model/user.js")

const listingsRoutes = require("./routes/listings.js")
const reviewsRoutes = require("./routes/review.js")
const userRoutes = require("./routes/user.js")




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

const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.get("/",(req,res)=>{
    res.send("hii i am root")
})

app.use(flash())
app.use(require("express-session")(sessionOptions))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) 

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        username: "Piyush",
        email: "Piyush@gmail.com",
   });
    let registeredUser = await User.register(fakeUser, "piyush123");
    res.send(registeredUser)
})


app.use("/listings", listingsRoutes)
app.use("/listings/:id/reviews", reviewsRoutes)
app.use("/", userRoutes)


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