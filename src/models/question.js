const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'checkbox', 'radio', 'textarea', 'select'],
        required: true
    },
    options: {
        type: [mongoose.Schema.Types.Mixed], // Only needed for 'checkbox', 'radio', and 'select' types
        required: function () {
            return ['checkbox', 'radio', 'select'].includes(this.type);
        }
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

questionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

questionSchema.set('toJSON', {
    virtuals: true
});

exports.Question = mongoose.model('Question', questionSchema);
