const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province',
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
