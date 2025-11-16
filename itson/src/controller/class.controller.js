const classRepository = require('../repository/class.repository');

/**
 * Controller function to get the students of a class by its id.
 * @param {Object} req 
 * @param {Object} res 
 */
exports.getStudentsByClassId = async (req, res) => 
{
    try {
        const {class_id} = req.query; 
        console.log(class_id); 
        const students = await classRepository.getStudentsByClassId(class_id);
        res.status(200).json(students);
    }
    catch (error) {
        res.status(500).json(error.message);
    }
}