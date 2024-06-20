const express = require('express');
const router = express.Router();

const questionnaireController = require('../controllers/questionnaireController');

const { getAll, getById, createQuestionnaire, updateData, deleteData } = questionnaireController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createQuestionnaire);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
