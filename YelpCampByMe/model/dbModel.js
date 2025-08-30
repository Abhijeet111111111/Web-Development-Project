const mongoose = require('mongoose')
const Review = require('./reviewsModel');
const User = require('./user');

// mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp')
//     .then(() => {
//         console.log('connected to db');
//     })
//     .catch((err) => {
//         console.log(err);
//     })

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () { // by doing this we are requesting cloudinary , images of 300 pixles under thumbnail
    return this.url.replace('/upload', '/upload/w_100');
})

const campgroundSchema = new mongoose.Schema({
    name: String,
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    city: String,
    description: String,
    images: [imageSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

campgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

const campgroundModel = mongoose.model('camgroundModel', campgroundSchema);
// exports.campgroundSchema
module.exports = campgroundModel