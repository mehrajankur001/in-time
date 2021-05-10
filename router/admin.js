const router = require('express').Router();
const User = require('../model/users')
const { registerUser, loginUser } = require('../middlewere/auth');

router.get('/login', (req, res) => {
    res.render('users/admin/login');
})
router.get('/register', (req, res) => {
    res.render('users/admin/register', { user: new User() });
})

router.post('/login', async (req, res) => {
    console.log(req.body)
    await loginUser(req.body, res, 'admin');

})
router.post('/register', async (req, res) => {
    console.log(req.body)
    console.log('----')
    await registerUser(req.body, res, 'admin');
})

module.exports = router