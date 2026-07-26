const User = require("../models/user");
const passport = require("passport");

module.exports.renderSignUp = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUpuser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust! 🌍");
            return res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust! 🌍");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been successfully logged out!");
        return res.redirect("/listings");
    });
};
