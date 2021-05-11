const router = require('express').Router();
const User = require('../model/users');
const { checkCookie, logout } = require('../middlewere/auth');

router.get('/', checkCookie, async (req, res) => {
    await logout(req, res);
});

router.get('/allDevices', checkCookie, async (req, res) => {
    try {
        req.user.tokens = [];
        res.clearCookie('jwt');
        await req.user.save();
        res.redirect(`/${req.user.role}/login/`);
    } catch (error) {
        console.log(error)
    }
});

module.exports = router