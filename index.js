const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./src/helpers/jwt');
const errorHandler = require('./src/helpers/error-handler');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.options('*', cors());

require('dotenv/config');
const api = process.env.API_URL;

// =======================================  Importing Routers  =====================================

const userRoutes = require('./src/routes/userRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const productRoutes = require('./src/routes/productRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const orderItemRoutes = require('./src/routes/orderItemRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const bankRoutes = require('./src/routes/bankRoutes');

// =======================================  Middleware  ============================================

app.use(express.json());
app.use(authJwt());
app.use(errorHandler);
app.use('/images', express.static(__dirname + '/src/public/uploads'));

// =======================================  Connection with MongoDB  ===============================

mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('Database Connected');
    })
    .catch((err) => {
        console.log('DB Not Connected', err);
    });

// =======================================  Routers  ===============================================

app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, orderRoutes);
app.use(`${api}/products`, productRoutes);
app.use(`${api}/customers`, customerRoutes);
app.use(`${api}/orderItems`, orderItemRoutes);
app.use(`${api}/payments`, paymentRoutes);
app.use(`${api}/banks`, bankRoutes);

// =======================================  Creating Server  =======================================

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
