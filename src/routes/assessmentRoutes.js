const express = require('express');
const router = express.Router();

const assessmentController = require('../controllers/assessmentController');

const { getAll, getById, createAssessment, updateData, deleteData } = assessmentController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createAssessment);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
