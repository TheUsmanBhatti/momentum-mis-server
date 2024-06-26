const mongoose = require('mongoose');

const stateSchema = mongoose.Schema({
    stateId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    countryId: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

stateSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

stateSchema.set('toJSON', {
    virtuals: true
});

exports.State = mongoose.model('State', stateSchema);
