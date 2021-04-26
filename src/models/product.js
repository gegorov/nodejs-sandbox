const fs = require('fs');
const path = require('path');
const rootRir = require('../util/path');
const Cart = require('./cart');

const FILE_PATH = path.join(rootRir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
  fs.readFile(FILE_PATH, (err, fileContent) => {
    if (err) {
      console.log('no products');
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex((prod) => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(FILE_PATH, JSON.stringify(updatedProducts), (e) => {
          if (e) {
            console.log('product update was not succesefull :(', e);
          }
        });
      } else {
        this.id = Date.now().toString();
        const newProducts = products.slice();
        newProducts.push(this);
        fs.writeFile(FILE_PATH, JSON.stringify(newProducts), (e) => {
          if (e) {
            console.log('save was not succesefull :(', e);
          }
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((p) => p.id !== id);

      fs.writeFile(FILE_PATH, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          console.log('deleting from cart');
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => {
        console.log('get products', p.id === id, id, p.id);
        console.log('id typoef', typeof id);
        console.log('p.id typoef', typeof p.id);
        return p.id === id;
      });
      cb(product);
    });
  }
};
