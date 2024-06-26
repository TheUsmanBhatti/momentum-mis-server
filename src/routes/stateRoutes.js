const express = require('express');
const router = express.Router();

const stateController = require('../controllers/stateController');

const { getAll, getById, createState, updateData, deleteData } = stateController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createState);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
