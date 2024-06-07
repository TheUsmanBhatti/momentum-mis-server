const express = require('express');
const router = express.Router();

const orderItemController = require('../controllers/orderItemController');

const { getAllOrderItem } = orderItemController;

router.post('/', getAllOrderItem);

module.exports = router;
