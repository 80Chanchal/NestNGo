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
    price:Number,
    location:String,
    country:String,
    latitude: {
        type: Number,
        required: false,
        default: 20.5937
    },
    longitude: {
        type: Number,
        required: false,
        default: 78.9629
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: false,
            default: 'Point'
     },
    coordinates: {
        type: [Number],
        required: false,
        default: [78.9629, 20.5937] // [longitude, latitude]
    }
    }
    

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id: { $in: listing.reviews}});
});

const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;