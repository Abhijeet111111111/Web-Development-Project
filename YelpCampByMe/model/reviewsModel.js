const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewsSchema = new Schema({
    review: String,
    rating: Number
})

const Review = mongoose.model('Review', reviewsSchema);

module.exports = Review;