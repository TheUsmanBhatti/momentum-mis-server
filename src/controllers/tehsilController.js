// =======================================  Importing Libraries  ================================================
const incrementStringId = require('../helpers/utils');
const { District } = require('../models/district');
const { Tehsil } = require('../models/tehsil');
const { UnionCouncil } = require('../models/unionCouncil');
const XLSX = require('xlsx');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await Tehsil.find();

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        const modifiedArr = result?.map((item) => {
            const obj = item.toObject();
            return {
                ...obj,
                value: item?.tehsilId
            };
        });

        res.status(200).send(modifiedArr);
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

// -------------------------------  Upload Tehsil

const uploadTehsils = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        const insertedTehsils = [];

        for (const row of data) {
            const { name, districtId } = row;

            if (!name || !districtId) {
                continue; // Skip rows with missing data
            }

            const check = await Tehsil.findOne({ name, districtId });
            if (check) {
                continue; // Skip already existing states
            }

            const checkBind = await District.findOne({ districtId });
            if (!checkBind) {
                continue; // Skip if country does not exist
            }

            const lastTehsil = await Tehsil.findOne().sort({ _id: -1 }).exec();
            let id = incrementStringId(lastTehsil?.tehsilId);

            const newTehsil = new Tehsil({
                tehsilId: id ? `T${id}` : 'T001',
                name,
                districtId
            });

            const result = await newTehsil.save();
            if (result) {
                insertedTehsils.push(result);
            }
        }

        return res.status(201).json({ success: true, message: 'Tehsils uploaded successfully', data: insertedTehsils });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

module.exports = {
    getAll,
    getById,
    createTehsil,
    updateData,
    deleteData,
    uploadTehsils
};
