const express = require('express');
const app = express();
const review = require('./routes/reviews')
const campground = require('./routes/campground')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('connect-flash');
const path = require('path')
const AppError = require('./utility/appError');


mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp').then(() => {
    console.log('connected to db');
})



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded())
app.use(methodOverride('_method'))

const sessionsConfig = {
    secret: 'thisshouldbeabettersecret',
    httpOnly: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionsConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campground);
app.use('/campgrounds', review);

app.get('/', (req, res) => {
    res.render('home');
})

app.all(/(.*)/, (req, res, next) => {
    next(new AppError('PAGE NOT FOUND', 404))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message } = err;
    if (!message) message = 'something went wrong!';
    res.status(statusCode).render('error', { message, err });
})

app.listen(8080, () => {
    console.log('listing to you!!!');
})