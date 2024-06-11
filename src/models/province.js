const mongoose = require('mongoose');

const provinceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

provinceSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

provinceSchema.set('toJSON', {
    virtuals: true
});

exports.Province = mongoose.model('Province', provinceSchema);
