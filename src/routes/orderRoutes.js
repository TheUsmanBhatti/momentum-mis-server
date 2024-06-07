const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

const { getAllOrders, getOrderById, createOrder, updateOrder, getAllOrdersForExcel, getOrderItemsByOrderId, getRepOrders } =
    orderController;

router.post('/list', getAllOrders);
router.get('/excel', getAllOrdersForExcel);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.get('/items/:id', getOrderItemsByOrderId);
router.post('/rep/:id', getRepOrders);

module.exports = router;
