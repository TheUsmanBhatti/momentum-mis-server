const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./src/helpers/jwt');
const errorHandler = require('./src/helpers/error-handler');

const port = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.options('*', cors());

require('dotenv/config');
const api = process.env.API_URL;

// =======================================  Importing Routers  =====================================

const userRoutes = require('./src/routes/userRoutes');

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

// =======================================  Creating Server  =======================================

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
