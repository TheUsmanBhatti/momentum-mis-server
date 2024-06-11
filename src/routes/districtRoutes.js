const express = require('express');
const router = express.Router();

const districtController = require('../controllers/districtController');

const { getAll, getById, createDistrict, updateData, deleteData } = districtController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createDistrict);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
