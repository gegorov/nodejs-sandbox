require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const commonController = require('./controllers/common');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const OrderItem = require('./models/order-item');
const Order = require('./models/order');

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(commonController.pageNotFound);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({ name: 'James Bond', email: 'james.bond@mi6.uk' });
    }
    return user;
  })
  .then((user) => user.getCart()
    .then((cart) => {
      if (!cart) {
        console.log('########## creating cart');
        return user.createCart();
      }
      return Promise.resolve();
    }))
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on prot ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
