const router = require('express').Router();
const User = require('../model/users')
const { registerUser, loginUser, checkCookie, checkRole, userAuth } = require('../middlewere/auth');


router.get('/login', (req, res) => {
    res.render('users/admin/login');
})
router.get('/register', (req, res) => {
    res.render('users/admin/register', { user: new User() });
})

router.post('/login', async (req, res) => {
    await loginUser(req.body, res, 'admin');

})
router.post('/register', async (req, res) => {
    await registerUser(req.body, res, 'admin');
})

router.get('/', checkCookie, userAuth, checkRole(['admin']), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log(user);
        res.status(200).render('users/admin/profile', { user: user });
    } catch (error) {
        res.json({
            message: 'Oh No'
        })
    }
})

module.exports = router