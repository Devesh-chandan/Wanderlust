const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user");

router.route("/signup")
    .get(userController.renderSignUp)
    .post(wrapAsync(userController.signUpuser));

router.get("/logout", userController.logoutUser);

router.route("/login")
    .get(userController.renderLogin)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.loginUser
    );

module.exports = router;
