var nodemailer = require('nodemailer');
const sendMail = async (req, res, secretCode) => {
    try {
        console
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'flash.delevery@gmail.com',
                pass: '$flash$delevery$'
            }
        });

        var mailOptions = {
            from: 'flash.delevery@gmail.com',
            to: req.body.email,
            subject: 'Verify InTime Account',
            text: `Secret Code: ${secretCode}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error)
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = { sendMail, randomInteger };