const express = require('express');
const router = express.Router();
const { validateSchema } = require('../Middlewares.js')
const catchAsync = require('../utility/catchAsync');
const { isLoggedIn, isAuthor } = require('../Middlewares.js')
const campgrounds = require('../controller/campgrounds.js')

router.get('/', catchAsync(campgrounds.index))

const storage = require('../cloudinary/index.js')

const multer = require('multer')
const upload = multer({ storage })

router.route('/new')
    .get(isLoggedIn, campgrounds.renderAddCampground)
    .post(isLoggedIn, upload.array('image'), validateSchema, catchAsync(campgrounds.makeNewCampground))

router.route('/edit/:id')
    .put(isLoggedIn, isAuthor, upload.array('image'), validateSchema, catchAsync(campgrounds.UpdateCampground))
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditCampground))

router.delete('/delete/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id', catchAsync(campgrounds.showCampground))



module.exports = router;