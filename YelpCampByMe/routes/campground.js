const express = require('express');
const router = express.Router();
const { validateSchema } = require('../Middlewares.js')
const catchAsync = require('../utility/catchAsync');
const campgroundModel = require('../model/dbModel')
const { isLoggedIn, isAuthor } = require('../Middlewares.js')




router.get('/', catchAsync(async (req, res) => {
    let allCampgrounds;
    await campgroundModel.find()
        .then(data => {
            allCampgrounds = data;
        })
    res.render('campground/campgrounds', { allCampgrounds });
}))

router.get('/addCampground', isLoggedIn, (req, res) => {
    res.render('campground/addCampground');
})

router.put('/updating.../:id', validateSchema, catchAsync(async (req, res) => {
    const updating = await campgroundModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.redirect(`/campgrounds/${req.params.id}`);
}))

router.get('/edit/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'cannot find campground');
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit', { campground })
}))

router.delete('/delete/:id', isAuthor, catchAsync(async (req, res) => {
    await campgroundModel.findByIdAndDelete(req.params.id);
    req.flash('success', 'successfully deleted campground!');
    res.redirect('/campgrounds');
    // res.send('deleting...')
}))


router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    let campground;
    await campgroundModel.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author').then(d => { // reviews not Review
        campground = d;
        console.log(d);
    });
    if (!campground) {
        req.flash('error', 'Campground does not exists!');
        return res.redirect('/campgrounds')
    }
    // const success = req.flash('success');
    res.render('campground/details', { campground })

}))

router.post('/new', isLoggedIn, validateSchema, catchAsync(async (req, res) => {
    // if (!req.body) throw new AppError('INVALID DATA', 400);
    const newCampground = await new campgroundModel(req.body);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'successfully made new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

module.exports = router;