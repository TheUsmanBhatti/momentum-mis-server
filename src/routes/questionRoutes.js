const express = require('express');
const router = express.Router();

const questionController = require('../controllers/questionController');

const { getAll, getById, createQuestion, updateData, deleteData } = questionController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createQuestion);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
