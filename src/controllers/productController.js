// =======================================  Importing Libraries  ================================================
const { Product } = require('../models/product');

// --------------------------- Get All Products

const getAllProducts = async (req, res) => {
    try {
        const result = await Product.find({ isDeleted: false });

        if (!result) {
            return res.status(404).json({ success: false, message: 'record not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Get All Product by Id

const getProductsById = async (req, res) => {
    try {
        const result = await Product.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ success: false, message: 'record not found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create Product

const createProduct = async (req, res) => {
    try {
        let { name } = req?.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'product name is required' });
        }

        const productCount = await Product.countDocuments();

        const insertProduct = new Product({
            ...req?.body,
            createdBy: req?.auth?.userId,
            serialNo: productCount + 1,
            createdOn: new Date()
        });
        const result = await insertProduct.save();

        if (!result) {
            res.status(500).json({ success: false, message: 'Product Not Inserted' });
        }
        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, quantity, packing, price } = req?.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(400).send('Invalid Product!');

        const result = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                quantity,
                price,
                packing,
                updatedBy: req?.auth?.userId,
                updatedOn: new Date()
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Product Not Found' });
        }

        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

const updateBulkProduct = async (req, res) => {
    try {
        const products = req?.body;

        const result = await Product.bulkWrite(
            products.map((product) => ({
                updateOne: {
                    filter: { _id: product._id },
                    update: { $set: { availableQuantity: product.availableQuantity } }
                }
            }))
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Product updated successfully' });
        }

        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const result = await Product.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
                deletedBy: req?.auth?.userId,
                deletedOn: new Date()
            },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ success: false, message: 'Product Not Found' });
        }
        return res.status(200).json({ success: true, message: 'Product Deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

module.exports = {
    getAllProducts,
    getProductsById,
    createProduct,
    deleteProduct,
    updateProduct,
    updateBulkProduct
};
