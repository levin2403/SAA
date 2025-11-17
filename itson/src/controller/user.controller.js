const authService = require('../service/auth.service');
const userRepository = require('../repository/user.repository');

/**
 * Controller function to get a user by his id.
 * @param {Object} req 
 * @param {Object} res 
 */
exports.validateUserCredentials = async (req, res) =>
{
    try {
        const { user_id, password } = req.body;
        const user = await authService.validateUserCredentials(user_id, password);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

/**
 * Controller function to get the classes of a student by his id.
 * @param {Object} req 
 * @param {Object} res 
 */
exports.getStudentClassesById = async (req, res) => 
{
    try {
        const { student_id } = req.query;
        const classes = await userRepository.getStudentClassesById(student_id);

        res.status(200).json(classes);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}

/**
 * Controller function to get the classes of a teacher by his id.
 * @param {Object} req 
 * @param {Object} res 
 */
exports.getProfessorClassesById = async (req, res) => 
{
    try {
        const { professor_id } = req.query;
        const classes = await userRepository.getProfessorClassesById(professor_id);
    
        res.status(200).json(classes);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}
    
