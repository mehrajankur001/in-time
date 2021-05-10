const express = require('express');
const router = express.Router();
const Marchant  = require('../model/marchants');

router.get('/', async (req, res) => {
    const marchants  = await Marchant .find();
    try {
      res.render('products/products', { marchants , marchants });
    } catch (error) {
      res.redirect('/');
    }
  });