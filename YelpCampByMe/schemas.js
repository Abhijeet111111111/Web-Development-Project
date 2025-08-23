const joi = require('joi') // used in server side validation 

module.exports = campgroundSchema = joi.object({
    // campground: joi.object({ ????????
    name: joi.string().required(),
    price: joi.number().required().min(0),
    city: joi.string().required(),
    // }).required()
})