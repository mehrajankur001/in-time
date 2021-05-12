const router = require('express').Router();
const User = require('../model/users')
const TempUser = require('../model/temp')
const { registerUser, loginUser, checkCookie, resetPassCookie, checkRole, userAuth, updateUser } = require('../middlewere/auth');
const { sendMail, randomInteger } = require('../middlewere/mailer')
var nodemailer = require('nodemailer');

router.get('/', (req, res) => {
    try {
        console.log(req.body);
        res.render(`users/reset-password`);
    } catch (error) {
        res.json({
            profile: 'Some Thing Wrong'
        })
    }
});


router.get('/profile', checkCookie, userAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.redirect(`/users/profile/${user.id}`);
    } catch (error) {
        res.json({
            profile: 'Some Thing Wrong'
        })
    }
})

router.get('/profile/:id', checkCookie, userAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).render(`users/${user.role}/profile`, { user: user });
    } catch (error) {
        res.json({
            profileId: 'Some Thing Wrong'
        })
    }
})

router.get('/reset-password-p1', (req, res) => {
    try {
        res.render(`users/reset-password-p1`);
    } catch (error) {
        res.json({
            profile: 'Some Thing Wrong'
        })
    }
});


let secretCode;

router.post('/reset-password-p1', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const tempUser = new TempUser({
                email: user.email
            })
            const token = await tempUser.generateToken();
            res.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 30000) });
            await tempUser.save();
            console.log(secretCode + ' inside 0')
            secretCode = undefined
            if (secretCode == undefined) {
                secretCode = randomInteger(1111, 9999)
                console.log(secretCode + ' inside 1')
                await sendMail(req, res, secretCode);
                console.log('Let us See what is going on');
                res.redirect('/users/reset-password-p2');
            }
        }
        else {
            res.status(406).json({
                message: 'No Such User'
            });
        }
    } catch (error) {
        console.log(error)
        res.json({
            profile: 'Some Thing Wrong p1'
        })
    }
});


router.get('/reset-password-p2', resetPassCookie, (req, res) => {
    try {
        console.log(secretCode + 'inside 2')
        setTimeout(() => {
            secretCode = undefined;
            console.log(req.user.tokens + ' inside 3')
        }, 30000)
        console.log(secretCode + 'inside 3')
        console.log(req.user.tokens + ' inside 3')
        res.render(`users/reset-password-p2`);

    } catch (error) {
        res.json({
            profile: 'Some Thing Wrong p2'
        })
    }
});

router.post('/reset-password-p2', resetPassCookie, async (req, res) => {
    console.log(req.user);
    console.log(secretCode + ' inside x')
    try {
        const tempUser = await TempUser.findById(req.user.id);
        if (req.body.code == secretCode) {
            console.log('success');
            secretCode = undefined;
            req.user.tokens = [];
            res.clearCookie.jwt
            await req.user.save()
            const token = await tempUser.generateToken();
            await tempUser.save();
            res.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 300000) });
            res.redirect('/users/reset-password-p3');
        } else {
            req.user.tokens = [];
            res.clearCookie('jwt');
            await req.user.save();
            console.log('failed')
            console.log(req.user.tokens + ' inside 4')
            res.render('users/reset-password-p1', { failedMessage: 'true' })
        }
    } catch (error) {
        console.log(error)
        res.json({
            profile: 'Some Thing Wrong post p2'
        })
    }
});



router.get('/reset-password-p3', resetPassCookie, async (req, res) => {
    try {
        const tempUser = await TempUser.findById(req.user.id);
        res.render('users/reset-password-p3', { user: tempUser });
    } catch (error) {
        console.log(error);
        res.json({
            m: 'What now ?'
        })
    }
});

router.put('/reset-password-p3', resetPassCookie, async (req, res) => {
    res.render('users/reset-password-p3')
});

module.exports = router