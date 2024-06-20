const express = require('express');
const router = express.Router();
const multer = require('multer');

const partnerController = require('../controllers/partnerController');

const { getAll, getById, createPartner, updateData, deleteData } = partnerController;

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createPartner);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
