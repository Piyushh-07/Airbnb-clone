const express = require('express');
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/users.js"); 
const user = require('../model/user.js');


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));



router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
);


router.route("/logout")
.get(userController.logout)
.get(userController.renderlogout);



module.exports = router;