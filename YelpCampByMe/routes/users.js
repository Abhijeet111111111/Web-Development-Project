const express = require('express');
const router = express.Router();
const User = require('../model/user');
const catchAsync = require('../utility/catchAsync');
const passport = require('passport');
const { containUrl } = require('../Middlewares');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => { // doesnot have to login after registering
            if (err) {
                return next(err);
            }
            req.flash('success', 'welcome to YelpCamp');
            res.redirect('/campgrounds');
        });

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register'); // redirect after flash
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', containUrl, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const returnToUrl = res.locals.returnTo || '/campgrounds';
    if (res.locals.returnToType == 'GET' || !res.locals.returnToType) {
        return res.redirect(returnToUrl); 
    }
    return res.redirect(307,returnToUrl); // redirect code for post request
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});

module.exports = router;