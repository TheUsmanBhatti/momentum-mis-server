const express = require('express');
const router = express.Router();

const tehsilController = require('../controllers/tehsilController');
const multer = require('multer');

const { getAll, getById, createTehsil, updateData, deleteData, uploadTehsils } = tehsilController;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createTehsil);
router.put('/', updateData);
router.delete('/:id', deleteData);
router.post('/upload', upload.single('file'), uploadTehsils);

module.exports = router;
