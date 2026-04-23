const express = require('express');
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
        });
        
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    async(req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect("/listings");
    }
);

router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
});

router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
    });
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
});

module.exports = router;