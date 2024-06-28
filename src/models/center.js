const mongoose = require('mongoose');

const centerSchema = mongoose.Schema({
    serialNo: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    village: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village',
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    updatedOn: {
        type: Date,
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    deletedOn: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
});

centerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

centerSchema.set('toJSON', {
    virtuals: true
});

exports.Center = mongoose.model('Center', centerSchema);