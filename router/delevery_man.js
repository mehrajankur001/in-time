const router = require('express').Router();
const User = require('../model/users')
const { registerUser, loginUser, checkCookie, checkRole, userAuth } = require('../middlewere/auth');


router.get('/login', (req, res) => {
    res.render('users/delevery-man/login');
})

router.get('/register', (req, res) => {
    res.render('users/delevery-man/register', { user: new User() });
})

router.post('/login', async (req, res) => {
    console.log(req.body)
    await loginUser(req.body, res, 'delevery-man');

})
router.post('/register', async (req, res) => {
    console.log(req.body)
    console.log('----')
    await registerUser(req.body, res, 'delevery-man');
})

router.get('/', checkCookie, userAuth, checkRole(['admin', 'delevery-man']), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log(user);
        res.status(200).render('users/delevery-man/profile', { user: user });
    } catch (error) {
        res.json({
            message: 'Oh No'
        })
    }
})

module.exports = router