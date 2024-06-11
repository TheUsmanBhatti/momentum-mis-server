const mongoose = require('mongoose');

const tehsilSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
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
