const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");


const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    location:String,
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            default:"Point",
        },
        coordinates:{
            type:[Number],
            default:[0,0],
        },
    },
    price:Number,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.index({ geometry: "2dsphere" });

listingSchema.post("findByIdAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({
            _id:{$in:listing.reviews}
        });
    }
});

const Listings=mongoose.model("Listings",listingSchema);
module.exports=Listings;
