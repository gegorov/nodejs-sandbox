const fs = require('fs');
const path = require('path');
const rootRir = require('../util/path');

const FILE_PATH = path.join(rootRir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch

    console.log(productPrice);
    fs.readFile(FILE_PATH, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0,
      };
      console.log('err read', err);
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // analyze the cart
      const existingProductIndex = cart.products.findIndex((product) => product.id === id);
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct;

      // add /increase
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += parseInt(productPrice, 10);
      fs.writeFile(FILE_PATH, JSON.stringify(cart), (e) => {
        console.log(e);
      });
    });
  }
};
