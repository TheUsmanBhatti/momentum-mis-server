const express = require('express');
const router = express.Router();

const bankController = require('../controllers/bankController');

const { getAllBanks, getBankById, createBank, updateBank, deleteBank } =
    bankController;

router.get('/', getAllBanks);
router.get('/:id', getBankById);
router.post('/', createBank);
router.put('/:id', updateBank);
router.delete('/:id', deleteBank);

module.exports = router;
