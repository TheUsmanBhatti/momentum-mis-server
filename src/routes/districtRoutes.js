const express = require('express');
const router = express.Router();

const districtController = require('../controllers/districtController');
const multer = require('multer');

const { getAll, getById, createDistrict, updateData, deleteData, uploadDistrict } = districtController;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createDistrict);
router.put('/', updateData);
router.delete('/:id', deleteData);
router.post('/upload', upload.single('file'), uploadDistrict);

module.exports = router;
