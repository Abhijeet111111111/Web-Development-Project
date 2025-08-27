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

const campgroundSchema = new mongoose.Schema({
    name: String,
    price: Number,
    city: String,
    description: String,
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