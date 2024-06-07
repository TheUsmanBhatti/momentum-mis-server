// =======================================  Importing Libraries  ================================================
const mongoose = require('mongoose');
const { Order } = require('../models/order');
const { OrderItem } = require('../models/orderItem');
const moment = require('moment');
// --------------------------- Get All Orders

// const getAllOrders = async (req, res) => {
//     try {
//         const { pageNumber, pageSize, querySearch, status } = req.query;
//         let query = {};

//         // Apply filters based on query parameters
//         if (querySearch) {
//             query.$or = [
//                 { 'user.firstName': { $regex: querySearch } }, // Case-insensitive search
//                 { 'user.lastName': { $regex: querySearch } },
//                 { 'customer.name': { $regex: querySearch } }
//             ];
//         }

//         if (status) {
//             query.status = status;
//         }

//         const skip = (pageNumber - 1) * pageSize;

//         // Sort orders by date in descending order
//         const orders = await Order.find(query)
//             .sort({ createdOn: -1 })
//             .skip(skip)
//             .limit(Number(pageSize))
//             .populate('user', 'firstName lastName')
//             .populate('customer', 'name');

//         // Assuming you have a totalCount variable representing the total number of orders
//         const totalCount = await Order.countDocuments(query);

//         const totalPages = Math.ceil(totalCount / pageSize);

//         const paginationMetadata = {
//             totalCount,
//             pageSize,
//             currentPage: Number(pageNumber),
//             totalPages,
//             previousPage: pageNumber > 1 ? 'Yes' : 'No',
//             nextPage: pageNumber < totalPages ? 'Yes' : 'No',
//             querySearch: querySearch || 'No Parameter Passed' // Update this based on your actual logic
//         };

//         const result = {
//             paginationMetadata,
//             items: orders
//         };

//         // const result = await Order.find({ isDeleted: false }).populate('user', 'firstName lastName').populate('customer', 'name').populate('products.product', 'name');

//         if (!result || result?.length == 0) {
//             return res.status(404).json({ success: false, message: 'Record not found' });
//         }

//         res.status(200).send(result);
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
//     }
// };

// const getAllOrders = async (req, res) => {
//     try {
//         const { pageNumber, pageSize, querySearch, status } = req.query;
//         const skip = (pageNumber - 1) * pageSize;

//         let queryData = new RegExp(querySearch, 'i');
//         // Sort orders by date in descending order
//         const orders = await Order.aggregate([
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'user',
//                     foreignField: '_id',
//                     as: 'user_data'
//                 }
//             },
//             {
//                 $unwind: '$user_data'
//             },
//             {
//                 $lookup: {
//                     from: 'customers',
//                     localField: 'customer',
//                     foreignField: '_id',
//                     as: 'customer_data'
//                 }
//             },
//             {
//                 $unwind: '$customer_data'
//             },
//             {
//                 $match: {
//                     $or: [
//                         { 'user_data.firstName': { $regex: queryData } },
//                         { 'user_data.lastName': { $regex: queryData } },
//                         { 'customer_data.name': { $regex: queryData } }
//                     ],
//                     isDeleted: false,
//                     ...(status && { status: status })
//                 }
//             },
//             { $sort: { createdOn: -1 } },
//             { $skip: Number(skip) },
//             { $limit: Number(pageSize) }
//         ]);

//         // Assuming you have a totalCount variable representing the total number of orders
//         const totalCount = await Order.countDocuments();

//         const totalPages = Math.ceil(totalCount / pageSize);

//         const paginationMetadata = {
//             totalCount,
//             pageSize,
//             currentPage: Number(pageNumber),
//             totalPages,
//             previousPage: pageNumber > 1 ? 'Yes' : 'No',
//             nextPage: pageNumber < totalPages ? 'Yes' : 'No',
//             querySearch: querySearch || 'No Parameter Passed' // Update this based on your actual logic
//         };

//         const result = {
//             paginationMetadata,
//             items: orders
//         };

//         // const result = await Order.find({ isDeleted: false }).populate('user', 'firstName lastName').populate('customer', 'name').populate('products.product', 'name');

//         if (!result?.items || result?.items?.length == 0) {
//             return res.status(404).json({ success: false, message: 'Record not found' });
//         }

//         res.status(200).send(result);
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
//     }
// };

const getAllOrders = async (req, res) => {
    try {
        // const { pageNumber, pageSize, querySearch, status } = req.query;
        const { repId, customerId, status, startDate, endDate, pageNumber, pageSize } = req?.body;

        const skip = (pageNumber - 1) * pageSize;

        const startDate1 = new Date(startDate);
        startDate1.setHours(0, 0, 0, 0);

        // Set end date to the end of the day
        const endDate1 = new Date(endDate);
        endDate1.setHours(23, 59, 59, 999);

        // Sort orders by date in descending order
        const orders = await Order.find({
            isDeleted: false,
            ...(repId && { user: repId }),
            ...(customerId && { customer: customerId }),
            ...(status && { status: status }),
            ...(startDate &&
                endDate && {
                    createdOn: {
                        $gte: startDate1,
                        $lte: endDate1
                    }
                })
        })
            .sort({ createdOn: -1 })
            // .skip(skip)
            // .limit(Number(pageSize))
            .populate('user', 'firstName lastName')
            .populate('customer', 'name');

        // Assuming you have a totalCount variable representing the total number of orders
        const totalCount = await Order.find({
            isDeleted: false,
            ...(repId && { user: repId }),
            ...(customerId && { customer: customerId }),
            ...(status && { status: status }),
            ...(startDate &&
                endDate && {
                    createdOn: {
                        $gte: startDate1,
                        $lte: endDate1
                    }
                })
        }).countDocuments();

        const totalPages = Math.ceil(totalCount / pageSize);

        const paginationMetadata = {
            totalCount,
            pageSize,
            currentPage: Number(pageNumber),
            totalPages,
            previousPage: pageNumber > 1 ? 'Yes' : 'No',
            nextPage: pageNumber < totalPages ? 'Yes' : 'No'
        };

        const result = {
            paginationMetadata,
            items: orders
        };

        if (!result?.items || result?.items?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

const getRepOrders = async (req, res) => {
    try {
        const { pageNumber, pageSize, querySearch, status } = req.body;
        const skip = (pageNumber - 1) * pageSize;
        const userId = new mongoose.Types.ObjectId(req?.params.id);
        let queryData = new RegExp(querySearch, 'i');
        // Sort orders by date in descending order
        const orders = await Order.aggregate([
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
                $match: {
                    user: userId,
                    $or: [{ 'customer_data.name': { $regex: queryData } }],
                    isDeleted: false,
                    status: { $in: status }
                }
            },
            { $sort: { createdOn: -1 } },
            { $skip: Number(skip) },
            { $limit: Number(pageSize) }
        ]);
        // Assuming you have a totalCount variable representing the total number of orders
        const totalCount = await Order.countDocuments();

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

const getAllOrdersForExcel = async (req, res) => {
    try {
        const orders = await Order.find({ isDeleted: false }).populate('user', 'firstName lastName').populate('customer', 'name');

        let result = orders?.map((order) => ({
            Id: order?.serialNo,
            Rep: `${order?.user?.firstName} ${order?.user?.lastName}`,
            Customer: order?.customer?.name,
            Status: order?.status,
            TotalProducts: order?.totalProducts,
            DateCreated: moment(order?.createdOn).format('MMM DD, YYYY - hh:mm A')
        }));

        // const result = await Order.find({ isDeleted: false }).populate('user', 'firstName lastName').populate('customer', 'name').populate('products.product', 'name');

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Get All Order by Id

const getOrderById = async (req, res) => {
    try {
        const result = await Order.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Get OrderItems by Order Id

const getOrderItemsByOrderId = async (req, res) => {
    try {
        const result = await OrderItem.find({ order: req.params.id }).populate('product', 'name');

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Order

const createOrder = async (req, res) => {
    try {
        let { user, customer, orderItems } = req?.body;

        if (!customer || !user) {
            return res.status(400).json({ success: false, message: 'Please enter user and customer' });
        }
        if (!orderItems || orderItems?.length == 0) {
            return res.status(400).json({ success: false, message: 'Please enter atleast one product' });
        }
        const count = await Order.countDocuments();

        const insertedOrder = new Order({
            ...req?.body,
            serialNo: count + 1,
            createdBy: req?.auth?.userId,
            totalProducts: orderItems?.length
        });

        // Update order items with the corresponding order ID
        const updatedOrderItems = orderItems.map((orderItem) => ({
            product: orderItem?.id,
            qtyOrder: orderItem?.qtyOrder?.replace(/\D/g, ''),
            qtyDispatch: orderItem?.qtyDispatch?.replace(/\D/g, ''),
            createdBy: req?.auth?.userId,
            order: insertedOrder._id,
            status: insertedOrder?.status,
            user,
            customer
        }));

        const result = await insertedOrder.save();
        // Insert or update order items
        const insertedOrderItems = await OrderItem.insertMany(updatedOrderItems, { ordered: false, rawResult: true });

        if (!result) {
            res.status(500).json({ success: false, message: 'Order not inserted' });
        }
        return res.status(201).send({ ...result, orderItems: insertedOrderItems });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// const updateOrder = async (req, res) => {
//     try {
//         let { user, customer, products } = req?.body;

//         const order = await Order.findById(req.params.id);
//         if (!order) return res.status(400).send('Invalid Order!');

//         if (!products || products?.length == 0) {
//             res.status(400).json({ success: false, message: 'Please enter atleast one product' });
//         }

//         const updatedOrderData = req.body;
//         const result = await Order.findByIdAndUpdate(
//             req.params.id,
//             { ...updatedOrderData, totalProducts: products?.length, updatedBy: req?.auth?.userId, updatedOn: new Date() },
//             { new: true }
//         );

//         if (!result) {
//             return res.status(404).json({ success: false, message: 'Order Not Found' });
//         }

//         return res.status(201).send(result);
//     } catch (err) {
//         return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
//     }
// };

const updateOrder = async (req, res) => {
    try {
        const { user, customer, orderItems } = req?.body;

        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Please provide orderId' });
        }

        const existingOrder = await Order.findById(req.params.id);

        if (!existingOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update order details
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                totalProducts: orderItems?.length || existingOrder.totalProducts,
                updatedBy: req?.auth?.userId,
                updatedOn: new Date()
            },
            { new: true }
        );

        // Update order items
        if (orderItems && orderItems.length > 0) {
            const updatedOrderItems = orderItems.map((orderItem) => ({
                ...orderItem,
                qtyOrder: orderItem?.qtyOrder?.replace(/\D/g, ''),
                qtyDispatch: orderItem?.qtyDispatch?.replace(/\D/g, ''),
                updatedBy: req?.auth?.userId,
                updatedOn: new Date(),
                order: updatedOrder?.id,
                status: updatedOrder?.status,
                user,
                customer
            }));

            // Use bulkWrite for updating multiple order items efficiently
            await OrderItem.bulkWrite(
                updatedOrderItems.map((orderItem) => ({
                    updateOne: {
                        filter: { _id: orderItem.id },
                        update: { $set: orderItem }
                    }
                }))
            );
        }

        return res.status(200).json({ success: true, updatedOrder });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

module.exports = { createOrder, updateOrder };

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    getAllOrdersForExcel,
    getOrderItemsByOrderId,
    getRepOrders
};
