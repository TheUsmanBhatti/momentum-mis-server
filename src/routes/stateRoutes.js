const express = require('express');
const router = express.Router();

const stateController = require('../controllers/stateController');
const multer = require('multer');

const { getAll, getById, createState, updateData, deleteData, uploadStates } = stateController;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createState);
router.post('/upload',  upload.single('file'), uploadStates);
router.put('/', updateData);
router.delete('/:id', deleteData);

module.exports = router;
