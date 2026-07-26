const Listings = require("../models/listings.js");
const { geocode } = require("../utils/geocode.js");
const { cloudinary } = require("../cloudConfig.js");

// Default high quality image fallback if no file or image URL provided
const DEFAULT_IMAGE = {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    filename: "default_listing_image",
};

// Helper function to safely upload to Cloudinary with Base64 data URI fallback
const processImageUpload = async (file) => {
    if (!file) return null;
    try {
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "Wanderlust_DEV" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(file.buffer);
        });
        return {
            url: uploadResult.secure_url,
            filename: uploadResult.public_id,
        };
    } catch (err) {
        console.warn("Cloudinary upload notice (using fallback Data URI):", err.message);
        const base64 = file.buffer.toString("base64");
        return {
            url: `data:${file.mimetype};base64,${base64}`,
            filename: file.originalname || "uploaded_image",
        };
    }
};

module.exports.index = async (req, res) => {
    const { q, category } = req.query;
    let queryObj = {};

    if (q && q.trim()) {
        const regex = new RegExp(q.trim(), "i");
        queryObj = {
            $or: [
                { title: regex },
                { description: regex },
                { location: regex },
                { country: regex },
                { category: regex }
            ]
        };
    } else if (category && category.trim()) {
        const regex = new RegExp("^" + category.trim() + "$", "i");
        queryObj = {
            $or: [
                { category: regex },
                { title: new RegExp(category.trim(), "i") },
                { description: new RegExp(category.trim(), "i") }
            ]
        };
    }

    const allListings = await Listings.find(queryObj);
    res.render("listings/index.ejs", {
        allListings,
        searchQuery: q || "",
        activeCategory: category || ""
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    const newlisting = new Listings(req.body.listing);

    // Process image file safely
    if (req.file) {
        const imgData = await processImageUpload(req.file);
        if (imgData) {
            newlisting.image = imgData;
        }
    }

    // Set default image if none uploaded or set
    if (!newlisting.image || !newlisting.image.url) {
        newlisting.image = DEFAULT_IMAGE;
    }

    // Geocode location
    try {
        const coords = await geocode(req.body.listing.location);
        newlisting.geometry = { type: "Point", coordinates: coords };
    } catch (geoErr) {
        console.warn("Geocoding failed for new listing:", geoErr.message);
        newlisting.geometry = { type: "Point", coordinates: [0, 0] };
    }

    newlisting.owner = req.user._id;
    await newlisting.save();

    req.flash("success", "New listing created successfully! 🏡");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listings.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    Object.assign(listing, req.body.listing);

    // Re-geocode if location changed
    try {
        const coords = await geocode(req.body.listing.location);
        listing.geometry = { type: "Point", coordinates: coords };
    } catch (geoErr) {
        console.warn("Geocoding failed on update:", geoErr.message);
    }

    // Process new image file if uploaded
    if (req.file) {
        const imgData = await processImageUpload(req.file);
        if (imgData) {
            listing.image = imgData;
        }
    }

    await listing.save();

    req.flash("success", "Listing updated successfully! ✅");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};