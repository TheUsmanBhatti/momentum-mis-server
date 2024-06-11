const express = require('express');
const router = express.Router();

const cityController = require('../controllers/cityController');

const { getAll, getById, createCity, updateData, deleteData } = cityController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createCity);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
