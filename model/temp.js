const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { SECRET } = require('../config/config');
const tempUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
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

tempUserSchema.methods.generateToken = async function () {
    try {
        const token = jwt.sign({
            user_id: this.id,
        }, SECRET);
        this.tokens = this.tokens.concat({ token })
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
        res.end(`Send error part`);
    }
}

module.exports = mongoose.model('Temp User', tempUserSchema);