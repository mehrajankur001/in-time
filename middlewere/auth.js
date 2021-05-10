const User = require('../model/users');
const bcrypt = require('bcryptjs');
const { SECRET } = require('../config/config');
const passport = require('passport');
//user registration
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
        console.log(newUser)
        console.log('_____')
        //creating the token
        const token = await newUser.generateToken();
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

//validate user email
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

//user login
const loginUser = async (userInfo, res, role) => {
    try {
        console.log(userInfo);
        let { email, password } = userInfo
        const user = await User.findOne({ email });
        console.log(user + '11user');
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
            console.log(token + ' aaa')
            res.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 600000000) });
            return res.redirect('/products');
        }
    } catch (error) {
        console.log(error);
        return res.status(406).json({
            message: 'SomeThing went wrong !!!'
        });
    }
}

//check Cookie
// const checkCookie = async (req, res, next) => {
//     try {
//         const token = req.cookie.jwt;
//         await jwt.compare(token, SECRET);
//         next();
//     } catch (error) {
//         res.status(404).json({
//             message: "Something went wrong, Come back later",
//             success: false
//         });
//     }
// }
const userAuth = passport.authenticate('jwt');

const checkRole = roles => (req, res, next) =>
    !roles.includes(req.user.role)
        ? res.status(401).json("Unauthorized Sad")
        : next();


module.exports = {
    registerUser,
    loginUser,
    userAuth,
    checkRole
}