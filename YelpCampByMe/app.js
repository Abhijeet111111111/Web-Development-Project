const mongoose = require('mongoose');
const express = require('express');
const methodOverride = require('method-override')
const path = require('path')
const app = express();
const dbModel = require('./model/dbModel')
const campgroundModel = dbModel.campgroundModel;

// path.set('views', path.join(__dirname, 'app'));

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded())
app.use(methodOverride('_method'))

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp').then(() => {
    console.log('connected to db');
})

app.get('/campgrounds', async (req, res) => {
    let allCampgrounds;
    await campgroundModel.find()
        .then(data => {
            allCampgrounds = data;
        })
    res.render('campground/campgrounds', { allCampgrounds });
})

app.get('/campgrounds/addCampground', (req, res) => {
    res.render('campground/addCampground');
})

app.put('/campgrounds/updating.../:id', async (req, res) => {
    const updating = await campgroundModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.redirect(`/campgrounds/${req.params.id}`);
})

app.get('/campgrounds/edit/:id', async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    res.render('campground/edit', { campground })
})

app.delete('/campgrounds/delete/:id', async (req, res) => {
    await campgroundModel.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
    // res.send('deleting...')
})


app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    let campground;
    await campgroundModel.findById(id).then(d => {
        campground = d;
        // console.log(d);
    });
    console.log(campground);
    res.render('campground/details', { campground })

})

app.post('/campgrounds/new', async (req, res) => {
    const { name, city } = req.body;
    const newCampground = await new campgroundModel(req.body);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
})



app.get('/', (req, res) => {
    res.render('home');
})

app.use(() => {
    console.log("got it!!!");
})


app.listen(8080, () => {
    console.log('listing to you!!!');
})