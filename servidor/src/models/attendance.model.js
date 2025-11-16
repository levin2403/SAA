const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: {type: String, required: true },
  status: { type: String, enum: ['PRESENT', 'ABSENT'], default: 'ABSENT' },
  updatedAt: { type: Date, default: Date.now }
});

const ClassSessionSchema = new mongoose.Schema({
  classId: {type: String, required: true },
  professorId: { type: String, required: true },
  date: { type: Date, required: true },
  attendances: [AttendanceRecordSchema],
  createdAt: { type: Date, default: Date.now }
});

// Un índice compuesto evita duplicar sesiones de una misma clase y fecha
ClassSessionSchema.index({ classId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('classSession', ClassSessionSchema);
