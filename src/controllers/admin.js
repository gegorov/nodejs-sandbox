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
  const {
    title, imageUrl, price, description,
  } = req.body;
  req.user.createProduct({
    title,
    price,
    imageUrl,
    description,
  })
    .then(() => {
      console.log('created product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/');
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;
  return req.user.getProducts({ where: { id: prodId } })
    .then((products) => {
      const product = products[0];
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
  console.log('update', title, price, imageUrl, description);
  Product.findByPk(prodId)
    .then((product) => product.update({
      title,
      price,
      imageUrl,
      description,
    }))
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  req.user.getProducts()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Products',
        path: '/admin/products',
      });
    }).catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => product.destroy())
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};
