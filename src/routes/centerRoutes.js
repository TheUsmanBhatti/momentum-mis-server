const express = require('express');
const router = express.Router();
const multer = require('multer');

const centerController = require('../controllers/centerController');

const { getAll, getById, createCenter, updateData, deleteData } = centerController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createCenter);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
