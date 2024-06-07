const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const { getAllUsers, getUsersById, createUser, signUpUser, signinUser, updateUser, updatePassword, setNewPassword, deleteUser, refreshToken } =
    userController;

router.get('/', getAllUsers);
router.get('/:id', getUsersById);
router.post('/signup', createUser);
router.post('/sign-up', signUpUser);
router.post('/signin', signinUser);
router.put('/:id', updateUser);
router.put('/updatePassword/:id', updatePassword);
router.put('/setPassword/:id', setNewPassword);
router.delete('/:id', deleteUser);
router.post('/refreshToken', refreshToken);

module.exports = router;
