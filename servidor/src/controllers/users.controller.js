const authService = require('../services/auth.service');
const userService = require('../integration/user.service');


// Controller function to handle the students of a certain class request
//exports.getStudentsByClassId = async(req, res) => 
//{
//  try {
//    const { class_id } = req.query;
//    const result = await userService.getStudentsByClassId(class_id);
//    res.status(200).json(result);
//  } catch (error) {
//    res.status(401).json(error.message);
//  }
//}
// Controller function to handle the students of a certain class request
exports.getUserClassesById = async(req, res) => 
  {
    try {
      const { user_id } = req.query;
      const result = await userService.getUserClassesById(user_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json(error.message);
    }
  }


// Controller function to handle logout requests
exports.handleGlobalLogout = async (req, res) => {
  const { id } = req.body;
  try {
      await logoutService.globalLogout(id);
      res.status(200).json();
  } catch (error) {
      res.status(500).json({ error: error.message }); 
  }
}

// Controller function to handle single device logout requests
exports.handleSingleDeviceLogout = async (req, res) => {
  const { id, refreshToken } = req.body;
  try {
      await logoutService.singleDeviceLogout(id, refreshToken);
      res.status(200).json();
  } catch (error) {
      res.status(500).json({ error: error.message }); 
  }
}
