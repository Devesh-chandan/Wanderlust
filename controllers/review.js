const Listings = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.reviewListing = async (req, res) => {
    let listing = await Listings.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();

    listing.reviews.push(newReview._id);
    await listing.save();

    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
};

// Bug fix: removed the misplaced `renderLogin` export — it belongs only in the user controller