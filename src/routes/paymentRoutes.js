const express = require('express');
const router = express.Router();
const multer = require('multer');

const paymentController = require('../controllers/paymentController');

const { getAllPayments, getRepPayments, createPayment, deletePayment } = paymentController;

// =======================================  Uploading Image  ====================================================

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }

        cb(uploadError, 'src/public/uploads');
    },
    filename: function (req, file, cb) {
        // const fileName = file.originalname.split(' ').join('-');
        const userId = req?.auth?.userId;
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `KKF-${userId}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.post('/byFilter', getAllPayments);
router.post('/rep/:id', getRepPayments);
router.post('/', uploadOptions.single('slip'), createPayment);
router.delete('/:id', deletePayment);

module.exports = router;
