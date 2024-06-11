// =======================================  Importing Libraries  ================================================
const { City } = require('../models/city');

// --------------------------- Get All

const getAll = async (req, res) => {
    try {
        const result = await City.find()

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
        const result = await City.findById(req.params.id);

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
        let { name, province } = req?.body;

        const check = await City.findOne({ name });
        if (check) return res.status(400).json({ success: false, message: `Already have a field ${name}` });

        const insert = new City({
            name,
            province
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
        const { id, name, province } = req?.body;
        const check = await City.findById(id);
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await City.findByIdAndUpdate(
            id,
            {
                name,
                province
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
        const check = await City.findById(req.params.id);
        if (!check) return res.status(400).send('Invalid Id!');

        const result = await City.findByIdAndDelete(req.params.id);

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
    createCity,
    updateData,
    deleteData,
};
