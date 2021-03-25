const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const commonController = require('./controllers/common');

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(commonController.pageNotFound);

app.listen(PORT, () => {
  console.log(`Server is running on prot ${PORT}`);
});
