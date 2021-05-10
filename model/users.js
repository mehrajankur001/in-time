const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { SECRET } = require('../config/config');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'delevery-man', 'user']
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.methods.generateToken = async function () {
    try {
        const token = jwt.sign({
            user_id: this.id,
            user_role: this.role
        }, SECRET);
        this.tokens = this.tokens.concat({ token })
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
        res.end(`Send error part`);
    }
}

module.exports = mongoose.model('User', userSchema);
