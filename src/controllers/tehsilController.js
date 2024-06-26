// =======================================  Importing Libraries  ================================================
const incrementStringId = require('../helpers/utils');
const { District } = require('../models/district');
const { Tehsil } = require('../models/tehsil');
const { UnionCouncil } = require('../models/unionCouncil');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await Tehsil.find();

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// --------------------------- Get All by Id

const getById = async (req, res) => {
    try {
        const result = await Tehsil.findOne({ tehsilId: req.params.id });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Tehsil Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Tehsil

const createTehsil = async (req, res) => {
    try {
        let { name, districtId } = req?.body;

        const check = await Tehsil.findOne({ name, districtId });
        if (check) return res.status(400).json({ success: false, message: `Already have a field ${name}` });

        const checkBind = await District.findOne({ districtId });
        if (!checkBind) return res.status(400).json({ success: false, message: `District not existed` });

        const lastTehsil = await Tehsil.findOne().sort({ _id: -1 }).exec();
        let id = incrementStringId(lastTehsil?.tehsilId);

        const insert = new Tehsil({
            tehsilId: id ? `T${id}` : 'T001',
            name,
            districtId
        });

        const result = await insert.save();

        if (!result) {
            res.status(500).json({ success: false, message: 'Not Inserted' });
        }
        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// ----------------------  Update

const updateData = async (req, res) => {
    try {
        const { districtId, name, tehsilId } = req?.body;
        const check = await Tehsil.findOne({ tehsilId });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkBind = await District.findOne({ districtId });
        if (!checkBind) return res.status(400).json({ success: false, message: `District not existed` });

        const result = await Tehsil.findByIdAndUpdate(
            check?._id,
            {
                name,
                districtId
            },
            { new: true }
        );

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// ----------------------- Delete

const deleteData = async (req, res) => {
    try {
        const check = await Tehsil.findOne({ tehsilId: req.params.id });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkBinding = await UnionCouncil.find({ tehsilId: check?.tehsilId });
        if (checkBinding?.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot Deleted, Union Council are binded with this Tehsil' });
        }

        const result = await Tehsil.findByIdAndDelete(check._id);

        if (result) {
            res.status(200).json({ success: true, message: 'Deleted' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

module.exports = {
    getAll,
    getById,
    createTehsil,
    updateData,
    deleteData
};
