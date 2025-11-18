const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: {type: String, required: true },
  status: { type: String, enum: ['PRESENT', 'ABSENT'], default: 'ABSENT' },
}, { _id: false });

const ClassSessionSchema = new mongoose.Schema({
  classId: { type: String, required: true },
  professorId: { type: String, required: true },
  date: { type: Date, required: true },
  attendances: [AttendanceRecordSchema]
});

// Un índice compuesto evita duplicar sesiones de una misma clase y fecha
ClassSessionSchema.index({ classId: 1, date: 1 }, { unique: true });  

module.exports = mongoose.model('classSession', ClassSessionSchema);
