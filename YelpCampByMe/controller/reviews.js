const Review = require('../model/reviewsModel')
const campgroundModel = require('../model/dbModel')


module.exports.postReview = async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    const newreview = new Review(req.body);
    newreview.author = req.user.id;
    campground.reviews.push(newreview);
    await newreview.save();
    await campground.save();
    req.flash('success', 'added your review!')
    res.redirect(`/campgrounds/${req.params.id}`)
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const result = await campgroundModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'deleted!');
    res.redirect(`/campgrounds/${id}`);
}