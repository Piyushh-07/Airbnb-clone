const express = require('express');
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/users.js"); 
const user = require('../model/user.js');



router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm); 

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
);

router.get("/logout", userController.logout);

router.get("/logout", userController.renderlogout);

module.exports = router;