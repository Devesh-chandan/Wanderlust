const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        // Bug fix: was `Date.now()` (invoked immediately, all reviews share same frozen timestamp)
        // Correct form is `Date.now` — Mongoose calls it per-document at creation time
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);