const User = require('../model/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerNewUser = async (req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const returnToUrl = res.locals.returnTo || '/campgrounds';
    if (res.locals.returnToType == 'GET' || !res.locals.returnToType) {
        return res.redirect(returnToUrl);
    }
    return res.redirect(307, returnToUrl); // redirect code for post request
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}