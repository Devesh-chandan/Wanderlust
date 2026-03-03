const Listing=require("./models/listings");
const Review=require("./models/review");
const  {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in first!!");
        return res.redirect("/login"); 
    }
    next();
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async (req,res,next)=>{
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "listing not found");
        return res.redirect("/listings");
    }

    if (!res.locals.currUsers || !listing.owner.equals(res.locals.currUsers._id)) {
        req.flash("error", "you dont have authority to update");
        return res.redirect(`/listings/${id}`);
    }
    next();
};




module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next(); 

    }};

// module.exports.validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);

//     if (error) {
//         let errMsg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};






// module.exports.isReviewAuthor=async (req,res,next)=>{
//     let {id, reviewId } = req.params;

//     const Review = await Review.findById(reviewId);

//     if (!Review.author.equals(res.locals.currUsers._id)) {
//         req.flash("error", "you dont have authority to Delete review");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// };



module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!res.locals.currUsers || !review.author.equals(res.locals.currUsers._id)) {
        req.flash("error", "you dont have authority to delete review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
