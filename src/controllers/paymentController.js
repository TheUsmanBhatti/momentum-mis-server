// =======================================  Importing Libraries  ================================================
const mongoose = require('mongoose');
const { Payment } = require('../models/payment');
const moment = require('moment');

// --------------------------- Get All Payment

const getAllPayments = async (req, res) => {
    try {
        const { bankId, repId, customerId, startDate, endDate } = req?.body;

        const startDate1 = new Date(startDate);
        startDate1.setHours(0, 0, 0, 0);

        // Set end date to the end of the day
        const endDate1 = new Date(endDate);
        endDate1.setHours(23, 59, 59, 999);

        // Sort payments by date in descending payment
        const result = await Payment.find({
            isDeleted: false,
            ...(bankId && { bank: bankId }),
            ...(repId && { user: repId }),
            ...(customerId && { customer: customerId }),
            ...(startDate &&
                endDate && {
                    createdOn: {
                        $gte: startDate1,
                        $lte: endDate1
                    }
                })
        })
            .populate('user', 'firstName lastName')
            .populate('customer', 'name')
            .populate('bank', 'name');

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Get Rep Payments

const getRepPayments = async (req, res) => {
    try {
        const { pageNumber, pageSize, querySearch } = req.body;
        const skip = (pageNumber - 1) * pageSize;
        const userId = new mongoose.Types.ObjectId(req?.params.id);
        let queryData = new RegExp(querySearch, 'i');
        // Sort orders by date in descending order
        const orders = await Payment.aggregate([
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer_data'
                }
            },
            {
                $unwind: '$customer_data'
            },
            {
                $lookup: {
                    from: 'banks',
                    localField: 'bank',
                    foreignField: '_id',
                    as: 'bank_data'
                }
            },
            {
                $unwind: '$bank_data'
            },
            {
                $match: {
                    user: userId,
                    $or: [{ 'customer_data.name': { $regex: queryData } }, { 'bank_data.name': { $regex: queryData } }],
                    isDeleted: false
                }
            },
            { $sort: { createdOn: -1 } },
            { $skip: Number(skip) },
            { $limit: Number(pageSize) }
        ]);
        // Assuming you have a totalCount variable representing the total number of orders
        const totalCount = await Payment.countDocuments();

        const totalPages = Math.ceil(totalCount / pageSize);

        const paginationMetadata = {
            totalCount,
            pageSize,
            currentPage: Number(pageNumber),
            totalPages,
            previousPage: pageNumber > 1 ? 'Yes' : 'No',
            nextPage: pageNumber < totalPages ? 'Yes' : 'No',
            querySearch: querySearch || 'No Parameter Passed' // Update this based on your actual logic
        };

        const result = {
            paginationMetadata,
            items: orders
        };

        // const result = await Order.find({ isDeleted: false }).populate('user', 'firstName lastName').populate('customer', 'name').populate('products.product', 'name');

        if (!result?.items || result?.items?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Payment

const createPayment = async (req, res) => {
    try {
        let { user, customer, bank } = req?.body;
        if (!customer || !user) {
            return res.status(400).json({ success: false, message: 'Please enter user and customer' });
        }
        if (!bank) {
            return res.status(400).json({ success: false, message: 'Please enter bank' });
        }

        const fileName = req?.file?.filename;

        // const file = req?.file;
        // if (!file) return res.status(400).send('No slip is uploaded');

        const count = await Payment.countDocuments();
        const insertPayment = new Payment({
            ...req?.body,
            slip: fileName || null,
            serialNo: count + 1,
            createdBy: req?.auth?.userId
        });

        const result = await insertPayment.save();

        if (!result) {
            res.status(500).json({ success: false, message: 'Payment not inserted' });
        }
        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

const updatePayment = async (req, res) => {
    try {
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

const deletePayment = async (req, res) => {
    try {
        const result = await Payment.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
                deletedBy: req?.auth?.userId,
                deletedOn: new Date()
            },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ success: false, message: 'Payment Not Found' });
        }
        return res.status(200).json({ success: true, message: 'Payment Deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

module.exports = {
    getAllPayments,
    getRepPayments,
    createPayment,
    deletePayment
};
