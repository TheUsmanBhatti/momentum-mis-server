const mongoose = require('mongoose');

const districtSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
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
