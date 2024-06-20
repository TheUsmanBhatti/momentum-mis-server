const mongoose = require('mongoose');

const assessmentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date,
        required: true
    },
    questionnaires: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Questionnaire'
        }
    ],
    users: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            status: {
                type: String,
                enum: ['not_started', 'in_progress', 'completed'],
                default: 'not_started'
            }
        }
    ],
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

assessmentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

assessmentSchema.set('toJSON', {
    virtuals: true
});

exports.Assessment = mongoose.model('Assessment', assessmentSchema);
