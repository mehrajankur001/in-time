const User = require('../model/users');
const bcrypt = require('bcryptjs');
const { SECRET } = require('../config/config');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const registerUser = async (userInfo, res, role) => {
    try {
        emailAlreadyNotTake = await validateUserEmail(userInfo.email);
        if (!emailAlreadyNotTake) {
            return res.status(404).json({
                message: "Email already Taken"
            })
        }
        //hashing the password
        var hashedPassword = await bcrypt.hash(userInfo.password, 10);
        //create a new User
        const newUser = new User({
            ...userInfo,
            password: hashedPassword,
            role
        });
        //creating the token
        const token = await newUser.generateToken();
        res.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 600000000) });
        await newUser.save();
        return res.redirect(`/${role}`);
    } catch (error) {
        //res.render(`/users/${role}/register`, { errorMessage: "User Not Registered" });
        //console.log(error)
        return res.status(404).json({
            message: "Something Wrong"
        })
    }
}
const validateUserEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        console.log(true);
        return true
    } else {
        console.log(false);
        return false
    }
    // return user ? false : true;
}

const loginUser = async (userInfo, res, role) => {
    try {
        let { email, password } = userInfo
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({
                message: 'User Not Found !!!'
            });
        }

        if (user.role !== role) {
            return res.status(406).json({
                message: 'Login from right Portal !!!'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(405).json({
                message: 'Incorrect Password !!!'
            });
        } else {
            const token = await user.generateToken();
            res.cookie('jwt', token, { httpOnly: true });
            return res.redirect(`/${role}`);
        }
    } catch (error) {
        console.log(error);
        return res.status(406).json({
            message: 'SomeThing went wrong !!!'
        });
    }
}

const updateUser = async (userInfo, res, req) => {
    let emailAlreadyNotTake = true;
    let hashedPassword;
    try {
        let user = await User.findById(req.params.id);
        if (user.email !== userInfo.email) {
            emailAlreadyNotTake = await validateUserEmail(userInfo.email);
        }
        if (!emailAlreadyNotTake) {
            return res.status(404).json({
                message: "Email already Taken"
            })
        }
        console.log('Before:' + user.password);
        if (userInfo.lastPassword != null && userInfo.lastPassword !== '') {
            if (userInfo.password != null && userInfo.password !== '') {
                const isMatch = await bcrypt.compare(userInfo.lastPassword, user.password);
                if (isMatch) {
                    user.password = await bcrypt.hash(userInfo.password, 10);
                } else {
                    return res.status(404).json({
                        message: "Wrong password"
                    })
                }
            }
        }
        console.log('After: ' + user.password);

        delete userInfo.lastPassword
        user.role = user.role;
        user.firstName = userInfo.firstName;
        user.lastName = userInfo.lastName;
        user.email = userInfo.email;
        user.gender = userInfo.gender;
        user.password = user.password;
        console.log(user)
        await user.save();
        res.redirect(`/${user.role}/${user.id}`)
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: " Inn Sha Allah I can fix it :)"
        })
    }
}

const userAuth = passport.authenticate('jwt');

const checkRole = roles => (req, res, next) =>
    !roles.includes(req.user.role)
        ? res.status(401).render('partials/unauthorized')
        : next();

const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        });
        res.clearCookie('jwt');
        await req.user.save();
        res.redirect(`/${req.user.role}/login/`);
    } catch (error) {
        console.log(error)
    }
}

const checkCookie = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyToken = await jwt.verify(token, SECRET);
        const user = await User.findOne({ _id: verifyToken.user_id });
        req.user = user;
        req.token = token
        next();
    } catch (error) {
        res.status(404).render('partials/unauthorized')
    }
}

module.exports = {
    checkCookie,
    registerUser,
    loginUser,
    userAuth,
    checkRole,
    logout,
    updateUser
}

