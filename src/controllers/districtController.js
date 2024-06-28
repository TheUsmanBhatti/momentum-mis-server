// =======================================  Importing Libraries  ================================================
const incrementStringId = require('../helpers/utils');
const { City } = require('../models/city');
const { District } = require('../models/district');
const { Tehsil } = require('../models/tehsil');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await District.find();

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        const modifiedArr = result?.map((item) => {
            const obj = item.toObject();
            return {
                ...obj,
                value: item?.districtId
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
        const result = await District.findOne({ districtId: req.params.id });

        if (!result) {
            return res.status(404).json({ success: false, message: 'District Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create District

const createDistrict = async (req, res) => {
    try {
        let { name, cityId } = req?.body;

        const check = await District.findOne({ name, cityId });
        if (check) return res.status(400).json({ success: false, message: `Already have a field ${name}` });

        const checkBind = await City.findOne({ cityId });
        if (!checkBind) return res.status(400).json({ success: false, message: `City not existed` });

        const lastDistrict = await District.findOne().sort({ _id: -1 }).exec();
        let id = incrementStringId(lastDistrict?.districtId);

        const insert = new District({
            districtId: id ? `D${id}` : 'D001',
            name,
            cityId
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
        const { districtId, name, cityId } = req?.body;
        const check = await District.findOne({ districtId });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkBind = await City.findOne({ cityId });
        if (!checkBind) return res.status(400).json({ success: false, message: `City not existed` });

        const result = await District.findByIdAndUpdate(
            check?._id,
            {
                name,
                cityId
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
        const check = await District.findOne({ districtId: req.params.id });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkBinding = await Tehsil.find({ districtId: check?.districtId });
        if (checkBinding?.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot Deleted, Tehsils are binded with this district' });
        }

        const result = await District.findByIdAndDelete(check._id);

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
    createDistrict,
    updateData,
    deleteData
};
