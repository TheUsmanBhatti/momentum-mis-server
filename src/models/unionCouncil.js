const mongoose = require('mongoose');

const unionCouncilSchema = mongoose.Schema({
    unionCouncilId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    tehsilId: {
        type: String,
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
