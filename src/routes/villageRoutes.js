const express = require('express');
const router = express.Router();

const villageController = require('../controllers/villageController');

const { getAll, getById, createVillage, updateData, deleteData } = villageController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createVillage);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
