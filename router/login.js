const router = require('express').Router();
const { loginUser } = require('../middlewere/auth');

router.get('/', (req, res) => {
    res.render('login');
})

router.post('/', async (req, res) => {
    await loginUser(req.body, res);

})

module.exports = router