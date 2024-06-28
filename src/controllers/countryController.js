// =======================================  Importing Libraries  ================================================
const incrementStringId = require('../helpers/utils');
const { Country } = require('../models/country');
const { State } = require('../models/state');
const XLSX = require('xlsx');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await Country.find().toArray();;

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        const modifiedArr = result?.map((item) => {
            const obj = item.toObject();
            return {
                ...obj,
                value: item?.countryId
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
        const result = await Country.findOne({ countryId: req.params.id });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Country Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Country

const createCountry = async (req, res) => {
    try {
        let { name } = req?.body;

        const check = await Country.findOne({ name });
        if (check) return res.status(400).json({ success: false, message: `Already have a field ${name}` });

        const lastCountry = await Country.findOne().sort({ _id: -1 }).exec();
        let id = incrementStringId(lastCountry?.countryId);

        const insert = new Country({
            name,
            countryId: id ? `C${id}` : 'C001'
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
        const { countryId, name } = req?.body;
        const check = await Country.findOne({ countryId });
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await Country.findByIdAndUpdate(
            check?._id,
            {
                name
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
        const check = await Country.findOne({ countryId: req.params.id });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkCountryStates = await State.find({ countryId: check?.countryId });
        if (checkCountryStates) {
            return res.status(400).json({ success: false, message: 'Cannot Deleted, States are binded with this country' });
        }

        const result = await Country.findByIdAndDelete(check?._id);
        if (result) {
            res.status(200).json({ success: true, message: 'Deleted' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// -------------------------------  Upload Countries

const uploadCountries = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        const insertedStates = [];

        for (const row of data) {
            const { name } = row;

            if (!name) {
                continue; // Skip rows with missing data
            }

            const check = await Country.findOne({ name });
            if (check) {
                continue; // Skip already existing states
            }

            const lastCountry = await Country.findOne().sort({ _id: -1 }).exec();
            let id = incrementStringId(lastCountry?.countryId);

            const newCountry = new Country({
                countryId: id ? `C${id}` : 'C001',
                name
            });

            const result = await newCountry.save();
            if (result) {
                insertedStates.push(result);
            }
        }

        return res.status(201).json({ success: true, message: 'Countries uploaded successfully', data: insertedStates });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

module.exports = {
    getAll,
    getById,
    createCountry,
    updateData,
    deleteData,
    uploadCountries
};
