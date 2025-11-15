const classModel = require('../model/class.model');

/**
 * Get the students of a class by the id given in the parameter.
 * @param {String} classId 
 * @returns 
 */
exports.getStudentsByClassId = async (classId) => 
{
    return await classModel.findOne({_id: classId}, {students: 1, _id: 0}).
        populate('students', {_id: 0, password: 0, rol: 0, classes: 0 });   
}