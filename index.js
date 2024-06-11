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
const countryRoutes = require('./src/routes/countryRoutes');
const provinceRoutes = require('./src/routes/provinceRoutes');
const cityRoutes = require('./src/routes/cityRoutes');
const districtRoutes = require('./src/routes/districtRoutes');
const tehsilRoutes = require('./src/routes/tehsilRoutes');
const unionCouncilRoutes = require('./src/routes/unionCouncilRoutes');
const villageRoutes = require('./src/routes/villageRoutes');


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
app.use(`${api}/countries`, countryRoutes);
app.use(`${api}/provinces`, provinceRoutes);
app.use(`${api}/cities`, cityRoutes);
app.use(`${api}/districts`, districtRoutes);
app.use(`${api}/tehsils`, tehsilRoutes);
app.use(`${api}/unionCouncils`, unionCouncilRoutes);
app.use(`${api}/villages`, villageRoutes);

// =======================================  Creating Server  =======================================

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
