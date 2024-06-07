const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

const { getAllProducts, getProductsById, createProduct, updateProduct, updateBulkProduct, deleteProduct } = productController;

router.get('/', getAllProducts);
router.get('/:id', getProductsById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.put('/update/bulk', updateBulkProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
