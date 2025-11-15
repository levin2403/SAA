const classRepository = require('../repository/class.repository');

/**
 * Controller function to get the students of a class by its id.
 * @param {Object} req 
 * @param {Object} res 
 */
exports.getStudentsByClassId = async (req, res) => 
{
    try {
        const classId = req.body.class_id;  
        const students = await classRepository.getStudentsByClassId(classId);
        res.status(200).json(students);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}