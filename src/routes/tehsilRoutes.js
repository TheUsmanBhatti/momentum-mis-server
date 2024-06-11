const express = require('express');
const router = express.Router();

const tehsilController = require('../controllers/tehsilController');

const { getAll, getById, createTehsil, updateData, deleteData } = tehsilController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createTehsil);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
