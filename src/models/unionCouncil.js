const mongoose = require('mongoose');

const unionCouncilSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tehsil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tehsil',
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

unionCouncilSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

unionCouncilSchema.set('toJSON', {
    virtuals: true
});

exports.UnionCouncil = mongoose.model('UnionCouncil', unionCouncilSchema);
