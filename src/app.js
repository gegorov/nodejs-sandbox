const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const PORT = 3000;
const app = express();

app.engine(
  'hbs',
  expressHbs(
    {
      layoutsDir: 'src/views/layouts',
      defaultLayout: 'main-layout',
      extname: 'hbs',
    },
  ),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Not Found', layout: false });
});

app.listen(PORT, () => {
  console.log(`Server is running on prot ${PORT}`);
});
