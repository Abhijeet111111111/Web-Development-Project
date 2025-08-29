const express = require('express');
const router = express.Router();
const campgroundModel = require('../model/dbModel')
const AppError = require('../utility/appError');
const catchAsync = require('../utility/catchAsync');
const { validateReviewsSchema, isLoggedIn, isReviewAuthor } = require('../Middlewares.js')
const reviews = require('../controller/reviews.js')


router.post('/:id/review', isLoggedIn, validateReviewsSchema, catchAsync(reviews.postReview))

router.delete('/:id/review/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;