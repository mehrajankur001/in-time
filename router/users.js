const router = require('express').Router();
const User = require('../model/users')
const TempUser = require('../model/temp')
const { registerUser, loginUser, checkCookie, resetPassword, resetPassCookie, checkRole, userAuth, updateUser } = require('../middlewere/auth');
const { sendMail, randomInteger } = require('../middlewere/mailer')

router.get('/', (req, res) => {
    try {
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
            res.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 300000) });
            await tempUser.save();
            secretCode = undefined
            if (secretCode == undefined) {
                secretCode = randomInteger(1111, 9999)
                console.log(secretCode + ' inside 1')
                await sendMail(req, res, secretCode);
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
        setTimeout(() => {
            secretCode = undefined;
        }, 300000)

        res.render(`users/reset-password-p2`);

    } catch (error) {
        res.json({
            profile: 'Some Thing Wrong p2'
        })
    }
});

router.post('/reset-password-p2', resetPassCookie, async (req, res) => {
    try {
        const tempUser = await TempUser.findOne({ _id: req.user.id });
        if (req.body.code == secretCode) {
            const user = await User.findOne({ email: tempUser.email });
            secretCode = undefined;
            req.user.tokens = [];
            res.clearCookie('jwt')
            req.user.save();
            tempUser.delete();
            console.log('Success')

            const token = await user.generateToken();
            res.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 300000) });
            await user.save()
            res.redirect('/users/reset-password-p3');
        } else {
            req.user.tokens = [];
            res.clearCookie('jwt');
            await req.user.save();
            console.log('failed')
            res.render('users/reset-password-p1', { failedMessage: 'true' })
        }
    } catch (error) {
        console.log(error)
        res.json({
            profile: 'Some Thing Wrong post p2'
        })
    }
});



router.get('/reset-password-p3', checkCookie, userAuth, async (req, res) => {
    try {
        if (req.user.role != undefined) {
            const user = await User.findById(req.user.id);
            res.status(200).render(`users/${user.role}/editPassword`, { user: user });
        } else {
            res.render('users/reset-password-p1', { failedMessage: 'true' });
        }
    } catch (error) {
        console.log(error);
        res.json({
            m: 'What now ?'
        })
    }
});

module.exports = router