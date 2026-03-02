const Listings = require("../models/listings.js");
const {geocode} = require("../utils/geocode.js");


module.exports.index=async (req,res)=>{
    const allListings =await Listings.find({});
    res.render("listings/index.ejs",{allListings});
    

};


module.exports.renderNewForm=(req,res)=>{
   
    
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listings.findById(req.params.id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
if(!listing){
     req.flash("error","listing not exists");
    return  res.redirect("/listings");
}
    res.render("listings/show.ejs",{listing});
}


module.exports.createListing=async (req, res,next) => {

    const newlisting = new Listings(req.body.listing);
    let url=req.file.path;
    let filename=req.file.filename;
    const coords = await geocode(req.body.listing.location);
    newlisting.geometry = {
        type: "Point",
        coordinates: coords
    };

    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
 req.flash("success","new listing successfully created!!");
    res.redirect("/listings");
   
}

module.exports.renderEditForm=async (req,res)=>{ 
    let {id}=req.params;
    const listing= await Listings.findById(id);
    res.render("listings/edit.ejs",{listing});


}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    
    


    const listing = await Listings.findById(id);
    if (listing) {
        Object.assign(listing, req.body.listing);
        const coords = await geocode(req.body.listing.location);
        listing.geometry = {
            type: "Point",
            coordinates: coords
        };
    }

    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
    }

    await listing.save();
   
    req.flash("success", "listing updated successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletelisting=await Listings.findByIdAndDelete(id);

    console.log(deletelisting);
     req.flash("error","listing successfully deleted!!");
    res.redirect("/listings");
}