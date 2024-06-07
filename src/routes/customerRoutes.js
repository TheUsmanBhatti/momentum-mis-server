const express = require('express');
const router = express.Router();

const customerControllerr = require('../controllers/customerController');

const { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomerByUser } = customerControllerr;

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.get('/rep/:id', getCustomerByUser);

module.exports = router;
