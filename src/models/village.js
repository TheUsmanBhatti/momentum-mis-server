const mongoose = require('mongoose');

const villageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    unionCouncil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UnionCouncil',
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

villageSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

villageSchema.set('toJSON', {
    virtuals: true
});

exports.Village = mongoose.model('Village', villageSchema);
