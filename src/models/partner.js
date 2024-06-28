const mongoose = require('mongoose');

const partnerSchema = mongoose.Schema({
    serialNo: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ''
    },
    industry: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
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

partnerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

partnerSchema.set('toJSON', {
    virtuals: true
});

exports.Partner = mongoose.model('Partner', partnerSchema);
