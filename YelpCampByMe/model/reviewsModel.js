const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./user')

const reviewsSchema = new Schema({
    review: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Review = mongoose.model('Review', reviewsSchema);

module.exports = Review;