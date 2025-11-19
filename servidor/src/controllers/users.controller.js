const userService = require('../integration/user.service');



// Controller function to handle the students of a certain class request
exports.getStudentClassesById = async(req, res) => 
{
  try {
    const { student_id } = req.query;
    const result = await userService.getStudentClassesById(student_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json(error.message);
  }
}

// Controller function to handle the professor classes request
exports.getProfessorClassesById = async(req, res) => 
{
  try {
    const { professor_id } = req.query;
    const result = await userService.getProfessorClassesById(professor_id);
    res.status(200).json(result);
  } catch (error) {
      res.status(401).json(error.message);
  }
}
