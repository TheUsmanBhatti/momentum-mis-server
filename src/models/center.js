const mongoose = require('mongoose');

const centerSchema = mongoose.Schema({
    serialNo: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    village: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village',
        required: true
    },
    unionCouncil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UnionCouncil',
        required: true
    },
    tehsil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tehsil',
        required: true
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
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