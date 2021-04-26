const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render(
    'admin/edit-product',
    {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
    },
  );
};

exports.postAddProduct = (req, res) => {
  console.log(req.body);
  const {
    title, imageUrl, price, description,
  } = req.body;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;

  if (!editMode) {
    console.log({ editMode });
    return res.redirect('/');
  }

  const prodId = req.params.productId;
  return Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect('/');
    }
    return res.render(
      'admin/edit-product',
      {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      },
    );
  });
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId;
  const {
    title, price, imageUrl, description,
  } = req.body;
  const updatedProduct = new Product(prodId, title, imageUrl, description, price);
  updatedProduct.save();

  return res.redirect('/admin/products');
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

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};
