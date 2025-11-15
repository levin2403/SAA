const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
  studentId: {
    type: String, // ID externo del alumno
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'present'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const ClassSessionSchema = new mongoose.Schema({
  classId: {
    type: String, // ID externo de la clase
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  recordedBy: {
    type: String, // ID del docente o usuario interno
    required: true
  },
  attendances: [AttendanceRecordSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Un índice compuesto evita duplicar sesiones de una misma clase y fecha
ClassSessionSchema.index({ classId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('classSession', ClassSessionSchema);
