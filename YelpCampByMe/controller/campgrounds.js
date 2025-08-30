const campgroundModel = require('../model/dbModel')
const { cloudinary } = require('../cloudinary') // !!!!!!!!
const maptilerClient = require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAPTILER_CLIENT_API_KEY;

module.exports.index = async (req, res) => {
    let allCampgrounds;
    await campgroundModel.find()
        .then(data => {
            allCampgrounds = data;
        })
    res.render('campground/campgrounds', { allCampgrounds });
}
module.exports.renderAddCampground = (req, res) => {
    res.render('campground/addCampground');
}
module.exports.UpdateCampground = async (req, res) => {
    const updating = await campgroundModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updating.images.push(...imgs);
    if (req.body.deleteImages) {
        await updating.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        for (filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    }
    await updating.save();
    res.redirect(`/campgrounds/${req.params.id}`);
}
module.exports.renderEditCampground = async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'cannot find campground');
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit', { campground })
}
module.exports.deleteCampground = async (req, res) => {
    await campgroundModel.findByIdAndDelete(req.params.id);
    req.flash('success', 'successfully deleted campground!');
    res.redirect('/campgrounds');
    // res.send('deleting...')
}
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    let campground;
    await campgroundModel.findById(id).populate({
        path: 'reviews',// reviews not Review becoz in campground schema in db model we have defined reviews not Review
        populate: {
            path: 'author'
        }
    }).populate('author').then(d => {
        campground = d;
        console.log(d);
    });
    if (!campground) {
        req.flash('error', 'Campground does not exists!');
        return res.redirect('/campgrounds')
    }
    // const success = req.flash('success');
    res.render('campground/details', { campground })

}
module.exports.makeNewCampground = async (req, res) => {
    // if (!req.body) throw new AppError('INVALID DATA', 400);
    const geoCode = await maptilerClient.geocoding.forward(req.body.city, {
        limit: 1
    })
    const newCampground = new campgroundModel(req.body);
    newCampground.geometry = geoCode.features[0].geometry;
    newCampground.author = req.user._id;
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await newCampground.save();
    req.flash('success', 'successfully made new campground!');
    res.rediresct(`/campgrounds/${newCampground._id}`);
}