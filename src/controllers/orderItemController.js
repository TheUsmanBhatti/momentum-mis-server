// =======================================  Importing Libraries  ================================================
const { MongooseError } = require('mongoose');
const { Order } = require('../models/order');
const { OrderItem } = require('../models/orderItem');
const moment = require('moment');
// --------------------------- Get All Orders

const getAllOrderItem = async (req, res) => {
    try {
        const { productId, repId, customerId, status, startDate, endDate } = req?.body;

        const startDate1 = new Date(startDate);
        startDate1.setHours(0, 0, 0, 0);

        // Set end date to the end of the day
        const endDate1 = new Date(endDate);
        endDate1.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            ...(status && { status: status }),
            ...(startDate &&
                endDate && {
                    createdOn: {
                        $gte: startDate1,
                        $lte: endDate1
                    }
                })
        });

        // Extract order IDs from the found orders
        const orderIds = orders.map((order) => order._id);

        const result = await OrderItem.find({
            ...(productId && { product: productId }),
            ...(repId && { user: repId }),
            ...(customerId && { customer: customerId }),
            order: { $in: orderIds } // Filter by order IDs
        })
            .populate('user', 'firstName lastName')
            .populate('customer', 'name')
            .populate('product')
            .populate('order', 'status');

        // // // Sort orders by date in descending order
        // const result = await OrderItem.find({
        //     ...(productId && { product: productId }),
        //     ...(repId && { user: repId }),
        //     ...(customerId && { customer: customerId }),
        //     ...(status && { status: status }),
        //     ...(startDate &&
        //         endDate && {
        //             createdOn: {
        //                 $gte: startDate1,
        //                 $lte: endDate1
        //             }
        //         })
        // })
        //     .populate('user', 'firstName lastName')
        //     .populate('customer', 'name')
        //     .populate('product', 'name')
        //     .populate('order', 'status');

        if (result) {
            const finalData = [];
            const map = new Map();

            result.forEach((item) => {
                const { product, qtyOrder, qtyDispatch, user, customer, status, createdOn, order } = item;
                const { _id, name, availableQuantity } = product;
                const numericQtyOrder = qtyOrder?.replace(/\D/g, ''); // Remove non-numeric characters
                const numericQtyDispatch = qtyDispatch?.replace(/\D/g, ''); // Remove non-numeric characters

                const key = `${_id}-${name}`;
                if (!map.has(key)) {
                    map.set(key, { productName: name, availableQuantity: availableQuantity, totalQtyOrder: 0, totalQtyDispatch: 0, totalQtyRemaining: 0, list: [] });
                }

                const entry = map.get(key);
                entry.totalQtyOrder += parseInt(numericQtyOrder);
                entry.totalQtyDispatch += parseInt(numericQtyDispatch);
                entry.totalQtyRemaining = entry.totalQtyOrder - entry.totalQtyDispatch;
                entry.list.push({
                    product,
                    qtyOrder: qtyOrder,
                    qtyDispatch: qtyDispatch,
                    user,
                    customer,
                    status: order?.status,
                    createdOn
                });
            });

            for (const entry of map.values()) {
                finalData.push(entry);
            }

            return res.status(200).send(finalData);
        }

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }
        // return res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

module.exports = {
    getAllOrderItem
};
