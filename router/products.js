const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { userAuth, checkCookie, checkRole } = require('../middlewere/auth');
const Product = require('../model/product');

//index
router.get('/', checkCookie, userAuth, checkRole(['delevery-man', 'admin']), async (req, res) => {
  let query = Product.find();
  const searchOptions = {};

  if (req.query.trackingId != null && req.query.trackingId !== '') {
    query = query.eq('trackingId', req.query.trackingId);
  }
  if (req.query.addedBefore != null && req.query.addedBefore !== '') {
    query = query.lte('createdAt', req.query.addedBefore);
  }
  if (req.query.addedAfter != null && req.query.addedAfter !== '') {
    query = query.gte('createdAt', req.query.addedBefore);
  }
  if (req.query.createdAt != null && req.query.createdAt !== '') {
    query = query.eq('createdAt', req.query.createdAt);
  }
  if (req.query.receiverName != null && req.query.receiverName != '') {
    query = query.regex(
      'receiverName',
      new RegExp(req.query.receiverName, 'i')
    );
  }
  if (req.query.receiverNumber != null && req.query.receiverNumber !== '') {
    searchOptions.receiverNumber = req.query.receiverNumber;
  }

  try {
    const product = await Product.find(searchOptions);
    const products = await query.exec();
    res.render('products/products', {
      products: products,
      searchOptions: req.query,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
//edit status
router.get('/:id/editProductStatus', checkCookie, userAuth, checkRole(['delevery-man', 'admin']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('products/editProductStatus', { product: product });
  } catch (error) { }
});

//update status
router.put('/:id/updateProductStatus', checkCookie, userAuth, checkRole(['delevery-man', 'admin']), async (req, res) => {
  let product, params;
  try {
    product = await Product.findById(req.params.id);

    if (req.body.otpNumber == null) {
      product.currentStatus = req.body.currentStatus;
      await product.save();
      if (req.user.role === 'admim') {
        res.redirect(`/products/${product.id}`);
      } else {
        res.redirect('/products');
      }
    } else {
      if (req.body.otpNumber == product.otpNumber) {
        product.currentStatus = 'Delevered';
        console.log('true');
        await product.save();
        if (req.user.role === 'admim') {
          res.redirect(`/products/${product.id}`);
        } else {
          res.redirect('/products');
        }
      } else {
        product.currentStatus = product.currentStatus;
        await product.save();
        res.render('products/editProductStatus', { product: product, errorMessage: 'Wrong OTP' })
      }
    }
  } catch (error) {
    console.log(error);
    res.redirect('/products');
  }
});

//all routes
router.all('*', checkCookie, userAuth, checkRole(['admin']));

//new
router.get('/new', async (req, res) => {
  renderFormPage(res, new Product(), 'new');
});

//post
router.post('/', async (req, res) => {
  const product = new Product({
    trackingId: uuidv4(),
    senderName: req.body.senderName,
    senderNumber: req.body.senderNumber,
    senderAddress: req.body.senderAddress,
    receiverName: req.body.receiverName,
    receiverNumber: req.body.receiverNumber,
    receiverAddress: req.body.receiverAddress,
    otpNumber: randomInteger(4444, 1111),
  });
  try {
    const newProduct = await product.save();
    res.redirect(`/products/${newProduct.id}`);
  } catch (error) {
    console.log(error);
    renderFormPage(res, product, 'new', true);
  }
});

//show
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render(`products/show`, { product: product });
  } catch (error) {
    console.log(error);
    res.redirect('/products');
  }
});

router.get('/:id/edit', async (req, res) => {
  const product = await Product.findById(req.params.id);
  renderFormPage(res, product, 'edit');
});

//update
router.put('/:id', async (req, res) => {
  let product;
  try {
    product = await Product.findById(req.params.id);
    product.senderName = req.body.senderName;
    if (req.body.senderNumber != null && req.body.senderNumber !== '') {
      product.senderNumber = req.body.senderNumber;
    }
    product.senderAddress = req.body.senderAddress;
    product.receiverName = req.body.receiverName;
    if (req.body.receiverNumber != null && req.body.receiverNumber !== '') {
      product.receiverNumber = req.body.receiverNumber;
    }
    product.receiverAddress = req.body.receiverAddress;
    await product.save();
    res.redirect(`/products/${product.id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/products');
  }
});

router.delete('/:id', async (req, res) => {
  let product;
  try {
    product = await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (error) {
    const params = { product: product };
    params.errorMessage = 'Could Not Delete this Product';
    res.render(`/products/${product.id}`);
  }
});




async function renderFormPage(res, product, form, hasError = false) {
  try {
    const params = { product: product };
    if (hasError) {
      if (form === 'new') {
        params.errorMessage = 'Error Creating Product';
      }
      if (form === 'edit') {
        params.errorMessage = 'Error Editing Product';
      }
      if (form === 'editCurrentStatus') {
        params.errorMessage = 'Error Editing Product';
      }
    }
    console.log(params);
    res.render(`products/${form}`, params);
  } catch (error) {
    res.redirect('/');
  }
}

//Random Number Generator for OTP Number
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = router;
