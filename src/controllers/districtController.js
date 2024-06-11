// =======================================  Importing Libraries  ================================================
const { District } = require('../models/district');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await District.find()

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
        const result = await District.findById(req.params.id);

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
        let { name, city } = req?.body;

        const check = await District.findOne({ name });
        if (check) return res.status(400).json({ success: false, message: `Already have a field ${name}` });

        const insert = new District({
            name,
            city
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
        const { id, name, city } = req?.body;
        const check = await District.findById(id);
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await District.findByIdAndUpdate(
            id,
            {
                name,
                city
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
        const check = await District.findById(req.params.id);
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await District.findByIdAndDelete(req.params.id);

        if(result){
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
    deleteData,
};
