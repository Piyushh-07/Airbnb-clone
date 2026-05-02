const User = require("../model/user");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

module.exports.signup = async (req, res) => {
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
};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};


module.exports.login = async(req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect(res.locals.redirectUrl || "/listings");
};


module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};


module.exports.renderlogout = (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
    });
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
};
