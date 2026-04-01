const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    location: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]

});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;