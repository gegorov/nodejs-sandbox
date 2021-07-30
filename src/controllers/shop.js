const Product = require('../models/product');

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res) => {
  const { id } = req.params;
  console.log('id getProducts', id);
  Product.findByPk(id)
    .then((product) => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/product-detail',
        product,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  req.user.getCart()
    .then((cart) => cart.getProducts())
    .then((products) => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  let newQuantity = 1;
  let fetchedCart;
  req.user.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;

      if (products.length > 0) {
        [product] = products;
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => fetchedCart.addProduct(product, { through: { quantity: newQuantity } }))
    .then(() => res.redirect('/cart'))
    .catch();
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then((cart) => cart.getProducts({ where: { id: prodId } }))
    .then((products) => {
      const [product] = products;
      product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(console.log);
};

exports.getOrders = (req, res) => {
  req.user.getOrders({ include: ['products'] })
    .then((orders) => {
      console.log('%%%%%%%%%%%%%%%%%%%%', orders[0].products);
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders,
      });
    })
    .catch(console.log);
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => Promise.all([req.user.createOrder(), products]))
    .then(([order, products]) => {
      order.addProducts(products.map((product) => {
        console.log('product', product);
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      }));
    })
    .then(() => fetchedCart.setProducts(null))
    .then(() => {
      res.redirect('/orders');
    })
    .catch(console.log);
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
