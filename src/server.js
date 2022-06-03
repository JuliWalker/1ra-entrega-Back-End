const express = require('express');
const morgan = require('morgan');
// const path = require('path');
const app = express();
const PORT = 8080
// const routesProducts = require('./routes/products')
import routesProducts from './routes/products'
// const routesCart = require('./routes/cart')
import routesCart from './routes/cart'


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname +'/routes/public'))


// app.set('views',path.join(__dirname, 'views' ));
// app.set('view engine','ejs')

app.use('/productos',routesProducts)
app.use('/carrito',routesCart)


/* app.get('/', (req, res) => {
    res.render('index');
}) */


try {
    app.listen(PORT);
    console.log(`Server on port ${PORT}...`)
} catch (error) {
    console.log('Error de conexión con el servidor...', error)
}