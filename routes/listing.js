const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))
    // Bug fix: removed debug console.log middleware that was logging req.body and req.file
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validatelisting,
        wrapAsync(listingController.createListing)
    );

// New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validatelisting,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;