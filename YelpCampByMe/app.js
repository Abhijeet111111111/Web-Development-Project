const mongoose = require('mongoose');
const express = require('express');
const methodOverride = require('method-override')
const path = require('path')
const app = express();
const campgroundModel = require('./model/dbModel')
const AppError = require('./utility/appError');
const catchAsync = require('./utility/catchAsync');
const { campgroundSchema, reviewsSchema } = require('./schemas.js')
const Review = require('./model/reviewsModel')
// path.set('views', path.join(__dirname, 'app'));

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded())
app.use(methodOverride('_method'))

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp').then(() => {
    console.log('connected to db');
})

const validateSchema = ((req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
})

const validateReviewsSchema = (req, res, next) => {
    const { error } = reviewsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new AppError(msg, 400);
    }
    else {
        next();
    }
}

app.get('/campgrounds', catchAsync(async (req, res) => {
    let allCampgrounds;
    await campgroundModel.find()
        .then(data => {
            allCampgrounds = data;
        })
    res.render('campground/campgrounds', { allCampgrounds });
}))

app.get('/campgrounds/addCampground', (req, res) => {
    res.render('campground/addCampground');
})

app.put('/campgrounds/updating.../:id', validateSchema, catchAsync(async (req, res) => {
    const updating = await campgroundModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.redirect(`/campgrounds/${req.params.id}`);
}))

app.get('/campgrounds/edit/:id', catchAsync(async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    res.render('campground/edit', { campground })
}))

app.delete('/campgrounds/delete/:id', catchAsync(async (req, res) => {
    await campgroundModel.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
    // res.send('deleting...')
}))


app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    let campground;
    await campgroundModel.findById(id).populate('reviews').then(d => { // reviews not Review
        campground = d;
        // console.log(d);
    });
    console.log(campground);
    res.render('campground/details', { campground })

}))

app.post('/campgrounds/new', validateSchema, catchAsync(async (req, res) => {
    // if (!req.body) throw new AppError('INVALID DATA', 400);
    const newCampground = await new campgroundModel(req.body);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

app.post('/campgrounds/:id/review', validateReviewsSchema, async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    const newreview = new Review(req.body);
    campground.reviews.push(newreview);
    await newreview.save();
    await campground.save();
    res.redirect(`/campgrounds/${req.params.id}`)
})

app.delete('/campgrounds/:id/review/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params;
    const result = await campgroundModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
})


app.get('/', (req, res) => {
    res.render('home');
})

app.all(/(.*)/, (req, res, next) => {
    next(new AppError('PAGE NOT FOUND', 404))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message } = err;
    if (!message) message = 'something went wrong!';
    res.status(statusCode).render('error', { message, err });
})

app.listen(8080, () => {
    console.log('listing to you!!!');
})