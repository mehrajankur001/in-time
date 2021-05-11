// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'mehrajd.ankur@gmail.com',
//         pass: 'newworldisnew123'
//     }
// });

// var mailOptions = {
//     from: 'mehrajd.ankur@gmail.com',
//     to: req.body.email,
//     subject: 'Verify InTime Account',
//     text: randomInteger(1111, 9999)
// };

// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });

// module.exports = transporter;