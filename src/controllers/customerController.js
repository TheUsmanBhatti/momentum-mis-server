// =======================================  Importing Libraries  ================================================
const { Customer } = require('../models/customer');

// --------------------------- Get All Customers

const getAllCustomers = async (req, res) => {
    try {
        const result = await Customer.find({ isDeleted: false }).populate('user', 'firstName lastName');

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// --------------------------- Get All Customer by Id

const getCustomerById = async (req, res) => {
    try {
        const result = await Customer.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ success: false, message: 'record not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Get All Customer by UserId

const getCustomerByUser = async (req, res) => {
    try {
        const result = await Customer.find({user: req.params.id}).select('name phoneNo address');

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'record not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Customer

const createCustomer = async (req, res) => {
    try {
        let { name, phoneNo, user } = req?.body;

        if (!name) {
            res.status(400).json({ success: false, message: 'Customer name is required' });
        }
        if (!phoneNo) {
            res.status(400).json({ success: false, message: 'phoneNo is required' });
        }
        if (!user) {
            res.status(400).json({ success: false, message: 'rep is required' });
        }
        const userCount = await Customer.countDocuments();
        const insertCustomer = new Customer({ ...req?.body, serialNo: userCount + 1, createdBy: req?.auth?.userId });
        const result = await insertCustomer.save();

        if (!result) {
            return res.status(500).json({ success: false, message: 'Customer not inserted' });
        }
        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { name, email, phoneNo, address, user } = req?.body;
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(400).send('Invalid Customer!');

        const result = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                phoneNo,
                address,
                user,
                updatedBy: req?.auth?.userId,
                updatedOn: new Date()
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Customer Not Found' });
        }

        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const result = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
                isActive: false,
                deletedBy: req?.auth?.userId,
                deletedOn: new Date()
            },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ success: false, message: 'Customer Not Found' });
        }
        res.status(200).json({ success: true, message: 'Customer Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerByUser
};
