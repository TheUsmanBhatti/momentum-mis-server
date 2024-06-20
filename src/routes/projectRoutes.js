const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');

const { getAll, getById, createProject, updateData, deleteData } = projectController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createProject);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
