const { DB, PORT } = require('./config/config')

const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.static('public'));

const expressEjsLayouts = require('express-ejs-layouts');
app.use(expressEjsLayouts);

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

const passport = require('passport')
const cors = require('cors');
app.use(cors());
app.use(passport.initialize());
require('./middlewere/passport')(passport);

var cookieParser = require('cookie-parser')
app.use(cookieParser())


//mongoose setup
const mongoose = require('mongoose');
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to Mongoose'));

//Home Route
const homeRoute = require('./router/home');
app.use('/', homeRoute);

//Product Route
const productRoute = require('./router/products');
app.use('/products', productRoute);

//Parcel Tracking Route
const parcelTrackingRoute = require('./router/trackYourParcel');
app.use('/trackYourParcel', parcelTrackingRoute);

//Admin Route
const adminRoute = require('./router/admin');
app.use('/admin', adminRoute);

//deleveryMan Route
const deleveryManRoute = require('./router/delevery_man');
app.use('/deleveryMan', deleveryManRoute);

//user Route
const userRoute = require('./router/user');
app.use('/user', userRoute);

//logout Route
const logoutRoute = require('./router/logout');
app.use('/logout', logoutRoute);

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
