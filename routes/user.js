const express = require('express');
const router = express.Router();
const User = require("../model/user.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup")
})

router.post("/signup", async(req,res)=>{
    try{
        const {username,email,password} = req.body  

        const newUser = new User({username,email,password});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to the Wanderlust!")
        res.redirect("/listings")
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while signing up");
    }
});

module.exports = router;