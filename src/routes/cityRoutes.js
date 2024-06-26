const express = require('express');
const router = express.Router();

const cityController = require('../controllers/cityController');
const multer = require('multer');

const { getAll, getById, createCity, updateData, deleteData, uploadCities } = cityController;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createCity);
router.put('/', updateData);
router.delete('/:id', deleteData);
router.post('/upload', upload.single('file'), uploadCities);

module.exports = router;
