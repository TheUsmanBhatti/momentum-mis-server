const express = require('express');
const router = express.Router();

const provinceContoller = require('../controllers/provinceController');

const { getAll, getById, createProvince, updateData, deleteData } = provinceContoller;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createProvince);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
