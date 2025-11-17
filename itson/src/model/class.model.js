const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    code: {type: String, required: true },
    name: { type: String, required: true },
    days: [{ type: String, required: true }],
    hours: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Virtuals activation
ClassSchema.set('toJSON', { virtuals: true });
ClassSchema.set('toObject', { virtuals: true });

// Remove virtual id
ClassSchema.set('id', false);

// Virtual function to count students
ClassSchema.virtual('studentCount').get(function () {
    return this.students?.length || 0;
});

ClassSchema.index({_id: 1, teacher: 1}, {unique: true});

module.exports = mongoose.model('Class', ClassSchema);