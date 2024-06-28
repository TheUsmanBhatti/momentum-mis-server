const express = require('express');
const router = express.Router();

const unionCouncilControlller = require('../controllers/unionCouncilControlller');
const multer = require('multer');

const { getAll, getById, createUnionCouncil, updateData, deleteData, uploadUnionCouncils } = unionCouncilControlller;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createUnionCouncil);
router.put('/', updateData);
router.delete('/:id', deleteData);
router.post('/upload', upload.single('file'), uploadUnionCouncils);

module.exports = router;
