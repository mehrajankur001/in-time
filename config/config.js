if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = {
    DB: process.env.DATABASE_URL,
    SECRET: process.env.SECRET,
    PORT: process.env.PORT
}