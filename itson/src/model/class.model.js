const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    name: { type: String, required: true },
    days: [{ type: Number, required: true }],
    hours: { type: String, required: true },
    teacher: { type: String, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

ClassSchema.index({_id: 1, teacher: 1}, {unique: true});

module.exports = mongoose.model('Class', ClassSchema);