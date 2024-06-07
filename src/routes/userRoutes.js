const express = require('express');
const router = express.Router();
const multer = require('multer');

const userController = require('../controllers/userController');

const {
    getAllUsers,
    getUsersById,
    createUser,
    signUpUser,
    signinUser,
    updateUser,
    updatePassword,
    setNewPassword,
    deleteUser,
    refreshToken
} = userController;

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
        cb(null, `MMIS-${userId}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get('/', getAllUsers);
router.get('/:id', getUsersById);
router.post('/', uploadOptions.single('avatar'), createUser);
router.post('/sign-up', signUpUser);
router.post('/signin', signinUser);
router.put('/:id', uploadOptions.single('avatar'), updateUser);
router.put('/updatePassword/:id', updatePassword);
router.put('/setPassword/:id', setNewPassword);
router.delete('/:id', deleteUser);
router.post('/refreshToken', refreshToken);

module.exports = router;
