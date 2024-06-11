const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

countrySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

countrySchema.set('toJSON', {
    virtuals: true
});

exports.Country = mongoose.model('Country', countrySchema);
