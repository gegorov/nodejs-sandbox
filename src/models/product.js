const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    alowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    alowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    alowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    alowNull: true,
  },
  description: {
    type: Sequelize.STRING,
    alowNull: true,
  },
});

module.exports = Product;
