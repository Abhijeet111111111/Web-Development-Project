const express = require('express');
const router = express.Router();
const campgroundModel = require('../model/dbModel')
const Review = require('../model/reviewsModel')
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');
const { validateReviewsSchema, isLoggedIn, isReviewAuthor } = require('../Middlewares.js')



router.post('/:id/review', isLoggedIn, validateReviewsSchema, catchAsync(async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    const newreview = new Review(req.body);
    newreview.author = req.user.id;
    campground.reviews.push(newreview);
    await newreview.save();
    await campground.save();
    req.flash('success', 'added your review!')
    res.redirect(`/campgrounds/${req.params.id}`)
}))

router.delete('/:id/review/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const result = await campgroundModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'deleted!');
    res.redirect(`/campgrounds/${id}`);
}))



module.exports = router;