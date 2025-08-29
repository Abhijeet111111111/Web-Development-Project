const joi = require('joi') // used in server side validation 

module.exports.campgroundSchema = joi.object({
    // campground: joi.object({ ????????
    name: joi.string().required(),
    price: joi.number().required().min(0),
    city: joi.string().required(),
    deleteImages: joi.array()
    // }).required()
})

module.exports.reviewsSchema = joi.object({
    rating: joi.number().min(0).max(5).required(),
    review: joi.string().required()
})