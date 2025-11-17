const userModel = require('../model/user.model');

/**
 * Find a user by the id given in the parameter.
 * @param {String} userId 
 * @returns 
 */
exports.getUserById = async (userId) => 
{
    try
    {
        return await userModel.findOne({id: userId}, {_id: 0, classes: 0});
    }
    catch(error)
    {
        console.log("Error al intentar obtener el usuario", error.message);
        throw new Error();
    }
}

/**
 * Get the classes of a student by the id given in the parameter.
 * @param {String} userId 
 * @returns 
 */
exports.getStudentClassesById = async (userId) => {
    return await userModel
      .findOne({ id: userId }, { _id: 0, classes: 1 })
      .populate({
        path: 'classes',
        select: { students: 0 },
        populate: {
          path: 'teacher',
          select: { _id: 0, name: 1 }
        },
        options: { lean: { virtuals: false } }
      })
      .lean({ virtuals: false });
  };
  

/**
  * Get all the classes that belong to a certain teacher
  * 
  * @param {String} professorId 
  * @returns 
*/
exports.getProfessorClassesById = async (professorId) => 
{ 
    return await userModel.findOne({ id: professorId}, {_id: 0, classes: 1}). 
    populate('classes', { teacher: 0});
}

