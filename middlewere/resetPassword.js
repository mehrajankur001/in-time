const User = require('../model/users');
const { sendMail, randomInteger } = require('../middlewere/mailer');
const jwt = require('jsonwebtoken');
let secretCode;

const resetPass1 = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(secretCode + ' inside 0')
        secretCode = undefined
        if (secretCode == undefined) {
            secretCode = randomInteger(1111, 9999)
            console.log(secretCode + ' inside 1')
            await sendMail(req, res, secretCode);
            console.log('Let us See what is going on');

            res.redirect('/users/reset-password-p2');
        }
    } catch (error) {
        console.log(error)
        res.json({
            profile: 'Some Thing Wrong'
        })
    }
}



const resetPass2 = async (req, res) => {

}

module.exports = {
    resetPass1, secretCode
}