// =======================================  Importing Libraries  ================================================
const { Partner } = require('../models/partner');
const { Project } = require('../models/project');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await Partner.find({ isDeleted: false });

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
        const result = await Partner.findOne({ _id: req?.params?.id, isDeleted: false });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Partner Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Partner

const createPartner = async (req, res) => {
    try {
        let { name, address, industry, type, isActive } = req?.body;

        const check = await Partner.findOne({ name });
        if (check) return res.status(400).json({ success: false, message: `Already have a field ${name}` });

        const lastPartner = await Partner.findOne().sort({ _id: -1 }).exec();

        const insert = new Partner({
            name,
            address,
            industry,
            type,
            isActive,
            serialNo: lastPartner?.serialNo + 1 || 0,
            createdBy: req?.auth?.userId
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
        const { id, name, address, industry, type, isActive } = req?.body;
        const check = await Partner.findById(id);
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await Partner.findByIdAndUpdate(
            id,
            {
                name,
                address,
                industry,
                type,
                isActive,
                updatedBy: req?.auth?.userId,
                updatedOn: new Date()
            },
            { new: true }
        );

        res.status(200).send({ success: true, updated: result });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// ----------------------- Delete

const deleteData = async (req, res) => {
    try {
        const check = await Partner.findById(req?.params?.id);
        if (!check) return res.status(400).send('Invalid Id!');

        const checkProjects = await Project.find({partner: req?.params?.id})
        if(checkProjects?.length > 0) return res.status(400).send(`Cannot Delete. There are ${checkProjects?.length} linked with this partner`);

        const result = await Partner.findByIdAndUpdate(
            req?.params?.id,
            {
                isDeleted: true,
                deletedBy: req?.auth?.userId,
                deletedOn: new Date()
            },
            { new: true }
        );

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
    createPartner,
    updateData,
    deleteData
};
