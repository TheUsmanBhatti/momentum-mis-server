const express = require('express');
const router = express.Router();

const countryController = require('../controllers/countryController');

const { getAll, getById, createCountry, updateData, deleteData } = countryController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createCountry);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
