const campground = require('./model/dbModel')
const Review = require('./model/reviewsModel')
const { reviewsSchema, campgroundSchema } = require('./schemas.js')
const AppError = require('./utility/appError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.session.returnToType = req.method;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}
module.exports.containUrl = (req, res, next) => { // this middleware stores previousUrl , because logging in clears the session
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
        res.locals.returnToType = req.session.returnToType;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    if (!camp.author._id.equals(req.user.id)) {
        req.flash('error', 'YOU  DONT HAVE PERMISSION TO DO THAT!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author._id.equals(req.user.id)) {
        req.flash('error', 'YOU  DONT HAVE PERMISSION TO DO THAT!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.validateSchema = ((req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
})

module.exports.validateReviewsSchema = (req, res, next) => {
    const { error } = reviewsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
}