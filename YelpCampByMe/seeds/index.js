const mongoose = require('mongoose');
const  cities  = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const dbModel = require('../model/dbModel')
const campgroundModel = dbModel.campgroundModel;

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp');


let makeAName = function () {
    const randomNum = Math.floor(Math.random() * descriptors.length);
    return `${descriptors[randomNum]} ${places[randomNum]}`;
}

const fillDb = async () => {
    await campgroundModel.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let campName = makeAName();
        // console.log(campName);
        
        let newCampground = new campgroundModel({ name: campName,city:cities[i].city });
        await newCampground.save();
    }
}

fillDb();