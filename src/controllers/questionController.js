// =======================================  Importing Libraries  ================================================
const { Question } = require('../models/question');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await Question.find({ isDeleted: false });

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
        const result = await Question.findOne({ _id: req?.params?.id, isDeleted: false });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Question Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Question

const createQuestion = async (req, res) => {
    try {
        let { text, type, options } = req?.body;

        const check = await Question.findOne({ text, type });
        if (check) return res.status(400).json({ success: false, message: `Already have a question "${text}" with type "${type}"` });

        const insert = new Question({
            text,
            type,
            options,
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
        const { id, text, type, options } = req?.body;
        const check = await Question.findById(id);
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await Question.findByIdAndUpdate(
            id,
            {
                text,
                type,
                options,
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
        const check = await Question.findById(req?.params?.id);
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await Question.findByIdAndUpdate(
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
    createQuestion,
    updateData,
    deleteData
};
