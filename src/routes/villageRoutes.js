const express = require('express');
const router = express.Router();

const villageController = require('../controllers/villageController');
const multer = require('multer');

const { getAll, getById, createVillage, updateData, deleteData, uploadVillages } = villageController;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createVillage);
router.put('/', updateData);
router.delete('/:id', deleteData);
router.post('/upload', upload.single('file'), uploadVillages);

module.exports = router;
