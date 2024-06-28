// =======================================  Importing Libraries  ================================================
const { Questionnaire } = require('../models/questionnaire');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await Questionnaire.find({ isDeleted: false }).populate('questions', 'text type options');

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
        const result = await Questionnaire.findOne({ _id: req?.params?.id, isDeleted: false }).populate('questions', 'text type options');

        if (!result) {
            return res.status(404).json({ success: false, message: 'Questionnaire Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Questionnaire

const createQuestionnaire = async (req, res) => {
    try {
        let { title, description, questions, isActive } = req?.body;

        const check = await Questionnaire.findOne({ title });
        if (check) return res.status(400).json({ success: false, message: `Already have a Questionnaire ${title}` });

        const insert = new Questionnaire({
            title,
            description,
            questions,
            isActive,
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
        const { id, title, description, questions, isActive } = req?.body;
        const check = await Questionnaire.findById(id);
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await Questionnaire.findByIdAndUpdate(
            id,
            {
                title,
                description,
                questions,
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
        const check = await Questionnaire.findById(req?.params?.id);
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await Questionnaire.findByIdAndUpdate(
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
    createQuestionnaire,
    updateData,
    deleteData
};
