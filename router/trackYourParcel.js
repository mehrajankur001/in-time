const express = require('express');
const router = express.Router();
const Product = require('../model/product');

let currentStatusData = {};

router.get('/', async (req, res) => {
  var searchOptions = {};

  if (req.query.trackingId != null && req.query.trackingId !== '') {
    searchOptions.trackingId = req.query.trackingId;
  }

  try {
    const products = await Product.find(searchOptions);
    if (
      Object.keys(searchOptions).length === 0 &&
      searchOptions.constructor === Object
    ) {
      currentStatusData.data = [];
    } else {
      currentStatusData.data = products;
    }
    res.render('trackParcel/index', {
      products: products,
      searchOptions: req.query,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/currentStatusData', async (req, res) => {
  res.json(currentStatusData);
});

module.exports = router;
