const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp')
//     .then(() => {
//         console.log('connected to db');
//     })
//     .catch((err) => {
//         console.log(err);
//     })

const campgroundSchema = new mongoose.Schema({
    name: String,
    price: Number,
    city: String,
    description:String
})

const campgroundModel = mongoose.model('camgroundModel', campgroundSchema);
// exports.campgroundSchema
exports.campgroundModel = campgroundModel;