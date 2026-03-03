const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const listingController=require("../controllers/listings");

const Listings=require("../models/listings.js");
const {isLoggedIn}=require("../middleware.js");
const{isOwner}=require("../middleware.js");
const{validatelisting}=require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload =multer({storage});


router.route("/")

.get(wrapAsync(listingController.index))

// .post(isLoggedIn, 
//      upload.single("listing[image]"),
//      validatelisting,
   
   
//     wrapAsync(listingController.createListing));

.post(isLoggedIn, 
      upload.single("listing[image]"), 
      validatelisting,
      wrapAsync(listingController.createListing));


// new listing

router.get("/new",isLoggedIn,listingController.renderNewForm);



router.route("/:id")
.get(wrapAsync(listingController.showListing))

.put(isLoggedIn, isOwner, upload.single("listing[image]"),
    validatelisting, wrapAsync(listingController.updateListing))

.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));






//edit route

router.get('/:id/edit',isLoggedIn,
    isOwner,wrapAsync(listingController.renderEditForm));








module.exports=router;