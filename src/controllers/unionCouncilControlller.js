// =======================================  Importing Libraries  ================================================
const incrementStringId = require('../helpers/utils');
const { Tehsil } = require('../models/tehsil');
const { UnionCouncil } = require('../models/unionCouncil');
const { Village } = require('../models/village');
const XLSX = require('xlsx');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await UnionCouncil.find();

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        const modifiedArr = result?.map((item) => {
            const obj = item.toObject();
            return {
                ...obj,
                value: item?.unionCouncilId
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
        const result = await UnionCouncil.findOne({ unionCouncilId: req.params.id });

        if (!result) {
            return res.status(404).json({ success: false, message: 'UnionCouncil Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create UnionCouncil

const createUnionCouncil = async (req, res) => {
    try {
        let { name, tehsilId } = req?.body;

        const check = await UnionCouncil.findOne({ name, tehsilId });
        if (check) return res.status(400).json({ success: false, message: `Already have a field ${name}` });

        const checkBind = await Tehsil.findOne({ tehsilId });
        if (!checkBind) return res.status(400).json({ success: false, message: `Tehsil not existed` });

        const lastUC = await UnionCouncil.findOne().sort({ _id: -1 }).exec();
        let id = incrementStringId(lastUC?.unionCouncilId);

        const insert = new UnionCouncil({
            unionCouncilId: id ? `U${id}` : 'U001',
            name,
            tehsilId
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
        const { unionCouncilId, name, tehsilId } = req?.body;
        const check = await UnionCouncil.findOne({ unionCouncilId });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkBind = await Tehsil.findOne({ tehsilId });
        if (!checkBind) return res.status(400).json({ success: false, message: `Tehsil not existed` });

        const result = await UnionCouncil.findByIdAndUpdate(
            check?._id,
            {
                name,
                tehsilId
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
        const check = await UnionCouncil.findOne({ unionCouncilId: req.params.id });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkBinding = await Village.find({ unionCouncilId: check?.unionCouncilId });
        if (checkBinding?.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot Deleted, Villages are binded with this union council' });
        }

        const result = await UnionCouncil.findByIdAndDelete(check._id);

        if (result) {
            res.status(200).json({ success: true, message: 'Deleted' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

const uploadUnionCouncils = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        const insertedUnionCouncils = [];

        for (const row of data) {
            const { name, tehsilId } = row;

            if (!name || !tehsilId) {
                continue; // Skip rows with missing data
            }

            const check = await UnionCouncil.findOne({ name, tehsilId });
            if (check) {
                continue; // Skip already existing states
            }

            const checkBind = await Tehsil.findOne({ tehsilId });
            if (!checkBind) {
                continue; // Skip if country does not exist
            }

            const lastUnionCouncil = await UnionCouncil.findOne().sort({ _id: -1 }).exec();
            let id = incrementStringId(lastUnionCouncil?.unionCouncilId);

            const newUnionCouncil = new UnionCouncil({
                unionCouncilId: id ? `U${id}` : 'U001',
                name,
                tehsilId
            });

            const result = await newUnionCouncil.save();
            if (result) {
                insertedUnionCouncils.push(result);
            }
        }

        return res.status(201).json({ success: true, message: 'UnionCouncils uploaded successfully', data: insertedUnionCouncils });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

module.exports = {
    getAll,
    getById,
    createUnionCouncil,
    updateData,
    deleteData,
    uploadUnionCouncils
};
