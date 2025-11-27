const userModel = require('../model/user.model');

/**
 * Find a user by the id given in the parameter.
 */
exports.getUserById = async (userId) => {
    try {
        return await userModel.findOne({id: userId}, {_id: 0, classes: 0});
    } catch(error) {
        console.log("Error al intentar obtener el usuario", error.message);
        throw new Error(error.message);
    }
}

/**
 * Get the classes of a student by the id given in the parameter.
 */
exports.getStudentClassesById = async (userId) => {
    // Simplificamos el populate para evitar errores de anidación complejos
    const user = await userModel.findOne({ id: userId }).populate('classes');
    return user;
};
  
/**
  * Get all the classes that belong to a certain teacher
  */
exports.getProfessorClassesById = async (professorId) => { 
    // CAMBIO IMPORTANTE: Quitamos proyecciones complejas y argumentos extra en populate
    // Esto reduce la posibilidad de errores internos de Mongoose
    const user = await userModel.findOne({ id: professorId }).populate('classes');
    return user;
}