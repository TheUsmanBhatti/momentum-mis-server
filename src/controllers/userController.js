// =======================================  Importing Libraries  ================================================
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const multer = require('multer');

// --------------------------- Get All Users

const getAllUsers = async (req, res) => {
    try {
        const result = await User.find({ isDeleted: false, role: '2003' }).select('-passwordHash');

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// --------------------------- Get All User by Id

const getUsersById = async (req, res) => {
    try {
        const result = await User.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Create User

const createUser = async (req, res) => {
    try {
        let { email, password } = req?.body;

        const checkEmail = await User.findOne({ email, isDeleted: false });
        if (checkEmail) return res.status(400).json({ success: false, message: 'Already have an account on this email' });

        const fileName = req?.file?.filename;
        const lastUser = await User.findOne().sort({ _id: -1 }).exec();

        const insertUser = new User({
            ...req?.body,
            email: email,
            avatar: fileName || null,
            passwordHash: bcrypt.hashSync(password, 11),
            createdBy: req?.auth?.userId,
            serialNo: lastUser?.serialNo + 1 || 0
        });

        const result = await insertUser.save();

        if (!result) {
            res.status(500).json({ success: false, message: 'User Not Inserted' });
        }
        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Sign-up User

const signUpUser = async (req, res) => {
    try {
        let { email, password } = req?.body;

        const checkEmail = await User.findOne({ email, isDeleted: false });
        if (checkEmail) return res.status(400).json({ success: false, message: 'Already have an account on this email' });

        const lastUser = await User.findOne().sort({ _id: -1 }).exec();

        const insertUser = new User({
            ...req?.body,
            email: email,
            passwordHash: bcrypt.hashSync(password, 10),
            serialNo: lastUser?.serialNo + 1 || 0,
            role: '8989'
        });

        const result = await insertUser.save();

        if (!result) {
            res.status(500).json({ success: false, message: 'User Not Inserted' });
        }
        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: err?.message || err });
    }
};

// --------------------------- Sign in user

const signinUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, isDeleted: false });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }

        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const secret = process.env.secret;

            const token = jwt.sign(
                {
                    userId: user?.id,
                    isActive: user?.isActive,
                    name: `${user?.firstName} ${user?.lastName}`,
                    role: user?.role
                },
                secret,
                { expiresIn: '1d' }
            );
            res.status(200).send({ token: token });
        } else {
            res.status(400).send({ message: 'Wrong Password' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// ----------------------  Update User

const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, qualification, designation, phoneNo, address } = req?.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send('Invalid User!');

        const fileName = req?.file?.filename;

        const result = await User.findByIdAndUpdate(
            req.params.id,
            {
                firstName,
                lastName,
                email,
                qualification,
                designation,
                phoneNo,
                address,
                ...(fileName && { avatar: fileName }),
                updatedBy: req?.auth?.userId,
                updatedOn: new Date()
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }
        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// --------------------- Update Password

const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send('Invalid User!');

        if (user && bcrypt.compareSync(req.body.oldPassword, user.passwordHash)) {
            var result = await User.findByIdAndUpdate(
                req.params.id,
                {
                    passwordHash: bcrypt.hashSync(req.body.newPassword, 10)
                },
                { new: true }
            );
        } else {
            res.status(400).send({ success: false, message: 'Wrong Password' });
        }

        if (!result) {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }

        res.status(200).json({ message: 'Password Changed Successfully', success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// ----------------------  Set New Password

const setNewPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send('Invalid User!');

        var result = await User.findByIdAndUpdate(
            req.params.id,
            {
                passwordHash: bcrypt.hashSync(req.body.newPassword, 10),
                updatedBy: req?.auth?.userId,
                updatedOn: new Date()
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }

        res.status(200).json({ message: 'Password Changed Successfully', success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// ----------------------- Delete User

const deleteUser = async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(
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
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }
        res.status(200).json({ success: true, message: 'User Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// ---------------------- Refresh Token

const refreshToken = async (req, res) => {
    try {
        const { token, decode } = req.body;

        if (!token) {
            return res.status(401).json({ error: 'Token is required' });
        }

        let secret = process.env.secret;

        jwt.verify(token, secret, (err, user) => {
            console.log('eeeeeeee ', err);
            if (err?.message == 'jwt expired') {
                const token = jwt.sign(
                    {
                        userId: decode.userId,
                        isActive: decode?.isActive,
                        name: decode?.name,
                        role: decode.role
                    },
                    secret,
                    { expiresIn: '7d' }
                );
                return res.status(200).send({ token: token });
            } else {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong!', error: error });
    }
};

module.exports = {
    getAllUsers,
    getUsersById,
    createUser,
    signUpUser,
    signinUser,
    updateUser,
    updatePassword,
    deleteUser,
    setNewPassword,
    refreshToken
};
