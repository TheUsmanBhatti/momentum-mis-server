const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    serialNo: {
        type: Number
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: ''
    },
    endDate: {
        type: Date,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    centers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Center' }],
    status: {
        type: String,
        enum: ['draft', 'in_progress', 'completed'],
        default: 'draft'
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

projectSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

projectSchema.set('toJSON', {
    virtuals: true
});

exports.Project = mongoose.model('Project', projectSchema);
