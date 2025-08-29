const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const passport = require('passport');
const { containUrl } = require('../Middlewares');
const users = require('../controller/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerNewUser))

router.route('/login')
    .get(users.renderLogin)
    .post(containUrl, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout);

module.exports = router;