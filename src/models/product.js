const fs = require('fs');
const path = require('path');
const rootRir = require('../util/path');

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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Date.now().toString();
    getProductsFromFile((products) => {
      const newProducts = products.slice();
      newProducts.push(this);
      fs.writeFile(FILE_PATH, JSON.stringify(newProducts), (e) => {
        if (e) {
          console.log('save was not succesefull :(', e);
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
