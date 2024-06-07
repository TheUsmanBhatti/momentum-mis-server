// =======================================  Importing Libraries  ================================================
const { Bank } = require('../models/bank');
const jwt = require('jsonwebtoken');

// --------------------------- Get All Banks

const getAllBanks = async (req, res) => {
    try {
        const result = await Bank.find({ isDeleted: false });

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// --------------------------- Get All Bank by Id

const getBankById = async (req, res) => {
    try {
        const result = await Bank.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Bank Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Bank

const createBank = async (req, res) => {
    try {
        let { name } = req?.body;

        const insertBank = new Bank({
            name,
            createdBy: req?.auth?.userId
        });

        const result = await insertBank.save();

        if (!result) {
            res.status(500).json({ success: false, message: 'Bank Not Inserted' });
        }
        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// ----------------------  Update Bank

const updateBank = async (req, res) => {
    try {
        const { name } = req?.body;
        const bank = await Bank.findById(req.params.id);
        if (!bank) return res.status(400).send('Invalid Bank!');

        const result = await Bank.findByIdAndUpdate(
            req.params.id,
            {
                name,
                updatedBy: req?.auth?.userId,
                updatedOn: new Date()
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Bank Not Found' });
        }
        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// ----------------------- Delete Bank

const deleteBank = async (req, res) => {
    try {
        const result = await Bank.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
                deletedBy: req?.auth?.userId,
                deletedOn: new Date()
            },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ success: false, message: 'Bank Not Found' });
        }
        res.status(200).json({ success: true, message: 'Bank Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

module.exports = {
    getAllBanks,
    getBankById,
    createBank,
    updateBank,
    deleteBank
};
