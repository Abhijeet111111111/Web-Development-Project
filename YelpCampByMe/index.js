const express = require('express');
const dbModel = require('./model/dbModel');
const { campgroundModel } = require('./model/dbModel');
const camgroundModel = dbModel.camgroundModel;
const app = express();

app.set('views', './views')
app.set('view engine', 'ejs');


app.get('/campground/index', async (req, res) => {
    let allCampgrounds;
    await campgroundModel.find()
        .then(data => {
            allCampgrounds = data;
        })
    res.render('campground/campgrounds', { allCampgrounds })
})

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(8080, () => {
    console.log('listing to 8080!')
})
