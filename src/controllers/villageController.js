// =======================================  Importing Libraries  ================================================
const incrementStringId = require('../helpers/utils');
const { UnionCouncil } = require('../models/unionCouncil');
const { Village } = require('../models/village');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await Village.find();

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        const modifiedArr = result?.map((item) => {
            const obj = item.toObject();
            return {
                ...obj,
                value: item?.villageId
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
        const result = await Village.findOne({ villageId: req.params.id });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Village Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Village

const createVillage = async (req, res) => {
    try {
        let { name, unionCouncilId } = req?.body;

        const check = await Village.findOne({ name, unionCouncilId });
        if (check) return res.status(400).json({ success: false, message: `Already have a field ${name}` });

        const checkBind = await UnionCouncil.findOne({ unionCouncilId });
        if (!checkBind) return res.status(400).json({ success: false, message: `UnionCouncil not existed` });

        const lastUC = await Village.findOne().sort({ _id: -1 }).exec();
        let id = incrementStringId(lastUC?.villageId);

        const insert = new Village({
            villageId: id ? `UC${id}` : 'UC001',
            name,
            unionCouncilId
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
        const { villageId, name, unionCouncilId } = req?.body;
        const check = await Village.findOne({ villageId });
        if (!check) return res.status(400).send('Invalid Id!');

        const checkBind = await UnionCouncil.findOne({ unionCouncilId });
        if (!checkBind) return res.status(400).json({ success: false, message: `Union Council not existed` });

        const result = await Village.findByIdAndUpdate(
            check?._id,
            {
                name,
                unionCouncilId
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
        const check = await Village.findOne({ villageId: req.params.id });
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await Village.findByIdAndDelete(check._id);

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
    createVillage,
    updateData,
    deleteData
};
