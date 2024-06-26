const mongoose = require('mongoose');

const districtSchema = mongoose.Schema({
    districtId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    cityId: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

districtSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

districtSchema.set('toJSON', {
    virtuals: true
});

exports.District = mongoose.model('District', districtSchema);
