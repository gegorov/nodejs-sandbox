const express = require('express');
const path = require('path');

const products = [];
const rootDir = require('../util/path');

const router = express.Router();

router.get('/add-product', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res) => {
  console.log(req.body);
  products.push({ title: req.body.title });
  res.redirect('/');
});

module.exports.routes = router;
module.exports.products = products;
