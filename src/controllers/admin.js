const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render(
    'admin/add-product',
    {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
    },
  );
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Products',
      path: '/admin/products',
    });
  });
};

exports.postAddProduct = (req, res) => {
  console.log(req.body);
  const {
    title, imageUrl, price, description,
  } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};
