// =======================================  Importing Libraries  ================================================
const incrementStringId = require('../helpers/utils');
const { City } = require('../models/city');
const { Country } = require('../models/country');
const { State } = require('../models/state');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await State.find();

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
        const result = await State.findOne({ stateId: req.params.id });

        if (!result) {
            return res.status(404).json({ success: false, message: 'State Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create State

const createState = async (req, res) => {
    try {
        let { name, countryId } = req?.body;

        const check = await State.findOne({ name, countryId });
        if (check) return res.status(400).json({ success: false, message: `Already have a field ${name}` });

        const checkBind = await Country.findOne({ countryId });
        if (!checkBind) return res.status(400).json({ success: false, message: `Country not existed` });

        const lastState = await State.findOne().sort({ _id: -1 }).exec();
        let id = incrementStringId(lastState?.stateId);

        const insert = new State({
            stateId: id ? `S${id}` : 'S001',
            name,
            countryId
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
        const { stateId, name, countryId } = req?.body;
        const check = await State.findOne({ stateId });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkBind = await Country.findOne({ countryId });
        if (!checkBind) return res.status(400).json({ success: false, message: `Country not existed` });

        const result = await State.findByIdAndUpdate(
            check?._id,
            {
                name,
                countryId
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
        const check = await State.findOne({ stateId: req.params.id });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkBinding = await City.find({ stateId: check?.stateId });
        if (checkBinding?.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot Deleted, Cities are binded with this state' });
        }

        const result = await State.findByIdAndDelete(check?._id);

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
    createState,
    updateData,
    deleteData
};
