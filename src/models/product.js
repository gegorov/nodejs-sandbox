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
};
