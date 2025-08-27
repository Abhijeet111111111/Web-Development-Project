const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const campgroundModel = require('../model/dbModel');

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp');


let makeAName = function () {
    const randomNum = Math.floor(Math.random() * descriptors.length);
    return `${descriptors[randomNum]} ${places[randomNum]}`;
}

const fillDb = async () => {
    await campgroundModel.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let campName = makeAName();
        let newCampground = new campgroundModel({
            name: campName,
            city: cities[i].city,
            author: '68ad8bad70c2fe77216de7ac'
        });
        await newCampground.save();
    }
}

fillDb();