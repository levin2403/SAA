const classModel = require('../model/class.model');

/**
 * Get the students of a class by the id given in the parameter.
 * @param {String} classId 
 * @returns 
 */
exports.getStudentsByClassId = async (classId) => 
{
    return await classModel.findOne(
        { _id: classId },
        { students: 1, _id: 0 }
      )
      .populate({
        path: 'students',
        select: { _id: 0, password: 0, rol: 0, classes: 0 },
        options: { lean: { virtuals: false } }
      })
      .lean({ virtuals: false });
};

/**
 * Gets the days that a certain class are being imparted
 * * @param {*} professorId
 * @param {*} class_id
 * @returns 
 */
exports.getProfessorClassDays = async (class_id) =>     
{ 
    return await classModel.findOne({ _id: class_id}, {_id: 0, days: 1}).
    lean({ virtuals: false });
}