const mongoose = require('mongoose');

const tehsilSchema = mongoose.Schema({
    tehsilId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    districtId: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

tehsilSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

tehsilSchema.set('toJSON', {
    virtuals: true
});

exports.Tehsil = mongoose.model('Tehsil', tehsilSchema);
