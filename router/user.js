const router = require('express').Router();
const User = require('../model/users')
const { registerUser, loginUser, checkCookie, checkRole, userAuth, updateUser } = require('../middlewere/auth');


router.get('/login', (req, res) => {
    res.render('users/user/login');
})
router.get('/register', (req, res) => {
    res.render('users/user/register', { user: new User() });
})

router.post('/login', async (req, res) => {
    console.log(req.body)
    await loginUser(req.body, res, 'user');
})
router.post('/register', async (req, res) => {
    console.log(req.body)
    console.log('----')
    await registerUser(req.body, res, 'user');
});

router.get('/', checkCookie, userAuth, checkRole(['admin', 'user']), async (req, res) => {
    let query = User.find({ role: 'user' });
    const searchOptions = {}
    if (req.query.firstName != null && req.query.firstName !== '') {
        query = query.regex('firstName', new RegExp(req.query.firstName, 'i'));
    }
    if (req.query.lastName != null && req.query.lastName !== '') {
        query = query.regex('lastName', new RegExp(req.query.lastName, 'i'));
    }
    try {
        const users = await query.exec();
        res.status(200).render('users/user/all', { users: users, searchOptions: req.query });
    } catch (error) {
        res.json({
            message: 'Oh No'
        })
    }
});

router.get('/:id', checkCookie, userAuth, checkRole(['admin', 'user']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        res.status(200).render(`users/user/show`, { user: user });
    } catch (error) {
        res.json({
            message: 'Oh No'
        })
    }
});

router.get('/:id/edit', checkCookie, userAuth, checkRole(['admin', 'user']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        res.status(200).render(`users/user/edit`, { user: user });
    } catch (error) {
        res.json({
            message: 'Oh No'
        })
    }
});

router.put('/:id', checkCookie, userAuth, checkRole(['admin', 'user']), async (req, res) => {
    try {
        await updateUser(req.body, res, req)
    } catch (error) {
        res.json({
            message: 'Oh No'
        })
    }
});

router.delete('/:id', checkCookie, userAuth, checkRole(['admin']), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        console.log(user);
        res.status(200).redirect('/user/all');
    } catch (error) {
        res.json({
            message: 'Oh No'
        })
    }
});

module.exports = router