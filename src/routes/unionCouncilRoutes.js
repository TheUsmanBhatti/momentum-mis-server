const express = require('express');
const router = express.Router();

const unionCouncilControlller = require('../controllers/unionCouncilControlller');

const { getAll, getById, createUnionCouncil, updateData, deleteData } = unionCouncilControlller;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createUnionCouncil);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
