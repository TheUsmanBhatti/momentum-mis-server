const express = require('express');
const router = express.Router();

const countryController = require('../controllers/countryController');
const multer = require('multer');

const { getAll, getById, createCountry, updateData, deleteData, uploadCountries } = countryController;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createCountry);
router.put('/', updateData);
router.delete('/:id', deleteData);
router.post('/upload',  upload.single('file'), uploadCountries);

module.exports = router;
