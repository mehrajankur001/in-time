const router = require('express').Router();
const User = require('../model/users');
const { checkCookie } = require('../middlewere/auth');
router.get('/', checkCookie, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        });
        await res.clearCookie('jwt');
        await req.user.save();
        res.redirect('/admin/login/');
    } catch (error) {
        console.log(error)
    }
});

router.get('/allDevices', checkCookie, async (req, res) => {
    try {
        req.user.tokens = [];
        await res.clearCookie('jwt');
        await req.user.save();
        res.redirect('/admin/login/');
    } catch (error) {
        console.log(error)
    }
});

module.exports = router