// =======================================  Importing Libraries  ================================================
const incrementStringId = require('../helpers/utils');
const { City } = require('../models/city');
const { District } = require('../models/district');
const { State } = require('../models/state');
const XLSX = require('xlsx');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await City.find();

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        const modifiedArr = result?.map((item) => {
            const obj = item.toObject();
            return {
                ...obj,
                value: item?.cityId
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
        const result = await City.findOne({ cityId: req.params.id });

        if (!result) {
            return res.status(404).json({ success: false, message: 'City Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create City

const createCity = async (req, res) => {
    try {
        let { name, stateId } = req?.body;

        const check = await City.findOne({ name, stateId });
        if (check) return res.status(400).json({ success: false, message: `Already have a field ${name}` });

        const checkBind = await State.findOne({ stateId });
        if (!checkBind) return res.status(400).json({ success: false, message: `State not existed` });

        const lastCity = await City.findOne().sort({ _id: -1 }).exec();
        let id = incrementStringId(lastCity?.cityId);

        const insert = new City({
            cityId: id ? `J${id}` : 'J001',
            name,
            stateId
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
        const { stateId, name, cityId } = req?.body;
        const check = await City.findOne({ cityId });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkBind = await State.findOne({ stateId });
        if (!checkBind) return res.status(400).json({ success: false, message: `State not existed` });

        const result = await City.findByIdAndUpdate(
            check?._id,
            {
                name,
                stateId
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
        const check = await City.findOne({ cityId: req.params.id });
        if (!check) return res.status(400).send('Invalid Id!');

        
        const checkBinding = await District.find({ cityId: check?.cityId });

        if (checkBinding?.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot Deleted, Districts are binded with this city' });
        }

        const result = await City.findByIdAndDelete(check?._id);

        if (result) {
            res.status(200).json({ success: true, message: 'Deleted' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// -------------------------------  Upload Cities

const uploadCities = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        const insertedCities = [];

        for (const row of data) {
            const { name, stateId } = row;

            if (!name || !stateId) {
                continue; // Skip rows with missing data
            }

            const check = await City.findOne({ name, stateId });
            if (check) {
                continue; // Skip already existing states
            }

            const checkBind = await State.findOne({ stateId });
            if (!checkBind) {
                continue; // Skip if country does not exist
            }

            const lastCity = await City.findOne().sort({ _id: -1 }).exec();
            let id = incrementStringId(lastCity?.cityId);

            const newCity = new City({
                cityId: id ? `J${id}` : 'J001',
                name,
                stateId
            });

            const result = await newCity.save();
            if (result) {
                insertedCities.push(result);
            }
        }

        return res.status(201).json({ success: true, message: 'Cities uploaded successfully', data: insertedCities });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

module.exports = {
    getAll,
    getById,
    createCity,
    updateData,
    deleteData,
    uploadCities
};
