const express = require('express');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res) => {
  const { products } = adminData;
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render('shop', {
    products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    shopCSS: true,
  });
});

module.exports = router;
