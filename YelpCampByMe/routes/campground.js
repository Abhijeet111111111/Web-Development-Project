const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../schemas.js')
const catchAsync = require('../utility/catchAsync');
const campgroundModel = require('../model/dbModel')
const AppError = require('../utility/appError');



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

router.get('/', catchAsync(async (req, res) => {
    let allCampgrounds;
    await campgroundModel.find()
        .then(data => {
            allCampgrounds = data;
        })
    res.render('campground/campgrounds', { allCampgrounds });
}))

router.get('/addCampground', (req, res) => {
    res.render('campground/addCampground');
})

router.put('/updating.../:id', validateSchema, catchAsync(async (req, res) => {
    const updating = await campgroundModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.redirect(`/campgrounds/${req.params.id}`);
}))

router.get('/edit/:id', catchAsync(async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'cannot find campground');
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit', { campground })
}))

router.delete('/delete/:id', catchAsync(async (req, res) => {
    await campgroundModel.findByIdAndDelete(req.params.id);
    req.flash('success', 'successfully deleted campground!');
    res.redirect('/campgrounds');
    // res.send('deleting...')
}))


router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    let campground;
    await campgroundModel.findById(id).populate('reviews').then(d => { // reviews not Review
        campground = d;
        // console.log(d);
    });
    if (!campground) {
        req.flash('error', 'Campground does not exists!');
        return res.redirect('/campgrounds')
    }
    // const success = req.flash('success');
    res.render('campground/details', { campground })

}))

router.post('/new', validateSchema, catchAsync(async (req, res) => {
    // if (!req.body) throw new AppError('INVALID DATA', 400);
    const newCampground = await new campgroundModel(req.body);
    await newCampground.save();
    req.flash('success', 'successfully made new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

module.exports = router;