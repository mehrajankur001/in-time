const User = require('../model/users');
const bcrypt = require('bcryptjs');
const { SECRET } = require('../config/config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const registerUser = async (userInfo, res, role) => {
    try {
        console.log(userInfo.firstName)
        console.log(userInfo.lastName)
        console.log(userInfo.password)
        console.log(userInfo.email)
        emailAlreadyNotTake = await validateUserEmail(userInfo.email);
        console.log('Email:' + emailAlreadyNotTake)
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
        console.log(newUser)
        await newUser.save();
        res.render('home');

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
            return res.redirect('/products');
        }
    } catch (error) {
        console.log(error);
        return res.status(406).json({
            message: 'SomeThing went wrong !!!'
        });
    }
}

const userAuth = passport.authenticate('jwt');

const checkRole = roles => (req, res, next) =>
    !roles.includes(req.user.role)
        ? res.status(401).render('partials/unauthorized')
        : next();


// const logout = async (req, res) => {
//     try {
//         await res.clearCookie('jwt');
//     } catch (error) {
//         console.log(error)
//     }
// }

//check Cookie
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
    //logout
}

