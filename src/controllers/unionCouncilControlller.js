// =======================================  Importing Libraries  ================================================
const incrementStringId = require('../helpers/utils');
const { Tehsil } = require('../models/tehsil');
const { UnionCouncil } = require('../models/unionCouncil');
const { Village } = require('../models/village');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await UnionCouncil.find();

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        const modifiedArr = result?.map((item) => ({
            ...item,
            value: item?.unionCouncilId
        }));

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

module.exports = {
    getAll,
    getById,
    createUnionCouncil,
    updateData,
    deleteData
};
