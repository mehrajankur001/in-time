const router = require('express').Router();
const User = require('../model/users')
const { registerUser, loginUser, checkCookie, checkRole, userAuth, updateUser } = require('../middlewere/auth');

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

router.post('/reset-password-p1', async (req, res) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mehrajd.ankur@gmail.com',
                pass: 'newworldisnew123'
            }
        });

        var mailOptions = {
            from: 'mehrajd.ankur@gmail.com',
            to: req.body.email,
            subject: 'Verify InTime Account',
            text: `Secret code: ${randomInteger(1111, 9999).toString()}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        console.log('Let us See what is going on');
        res.redirect('/users/reset-password-p2');
    } catch (error) {
        res.json({
            profile: 'Some Thing Wrong'
        })
    }
});

router.get('/reset-password-p2', (req, res) => {
    try {
        res.render(`users/reset-password-p2`);
    } catch (error) {
        res.json({
            profile: 'Some Thing Wrong'
        })
    }
});

router.post('/reset-password-p2', (req, res) => {
    try {
        res.render(`users/reset-password-p2`);
    } catch (error) {
        res.json({
            profile: 'Some Thing Wrong'
        })
    }
});

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = router