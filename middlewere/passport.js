const User = require('../model/users');
const JwtStrategy = require('passport-jwt').Strategy;
const { SECRET } = require('../config/config');

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};
const opts = {
    secretOrKey: SECRET,
    jwtFromRequest: cookieExtractor
}

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.user_id);
            if (user) {
                console.log("Ankur Awsome")
                console.log(user)
                console.log("Ankur")
                return done(null, user);
            } else {
                console.log("Ankur boo")
                console.log(user)
                return done(null, false);
                // or you could create a new account
            }
        } catch (error) {
            console.log(err)
            return done(err, false);
        }
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}