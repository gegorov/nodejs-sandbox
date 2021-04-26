const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll((prods) => {
    res.render('shop/product-list', {
      prods,
      pageTitle: 'All products',
      path: '/products',
    });
  });
};

exports.getProduct = (req, res) => {
  const { id } = req.params;
  console.log('id getProducts', id);
  Product.findById(id, (product) => {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/product-detail',
      product,
    });
  });
};

exports.getIndex = (req, res) => {
  Product.fetchAll((prods) => {
    res.render('shop/index', {
      prods,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getCart = (req, res) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = products.reduce((acc, product) => {
        const matchedProduct = cart.products.find((cp) => cp.id === product.id);
        if (matchedProduct) {
          return [...acc, { productData: product, qty: matchedProduct.qty }];
        }
        return acc;
      }, []);
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res) => {
  const id = req.body.productId;
  Product.findById(id, (product) => {
    console.log('id', id);
    console.log('product', product);
    Cart.addProduct(id, product.price);
    res.redirect('/');
  });
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
  });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
