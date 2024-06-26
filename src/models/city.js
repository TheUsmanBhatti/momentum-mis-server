const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    cityId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    stateId: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

citySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

citySchema.set('toJSON', {
    virtuals: true
});

exports.City = mongoose.model('City', citySchema);
