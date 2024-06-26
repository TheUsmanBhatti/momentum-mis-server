const mongoose = require('mongoose');

const villageSchema = mongoose.Schema({
    villageId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    unionCouncilId: {
        type: String,
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
