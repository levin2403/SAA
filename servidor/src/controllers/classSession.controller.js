const getClassSessionService = require('../services/getClassSession.service');
const updateAttendanceService = require('../services/updateAttendance.service')
const classSessionReposistory = require('../repositories/classSession.repository');

/**
 * Controller method to get the class session
 * @param {Object} req 
 * @param {Object} res 
 */
exports.getClassSession = async(req, res) => {
  try {
    const { class_id, professor_id, date } = req.query;
    const classSession =  await getClassSessionService.
          getClassSession(class_id, professor_id, date);

    res.status(200).json(classSession);
  } catch (error) {
    res.status(403).json(error.message);
  }
}

/**
 * Controller method to update the attendances of a class session
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.updateAttendance = async(req, res) => {
  try {
    const { class_session_id, attendances} = req.body;
    await updateAttendanceService.uptdateAttendance(class_session_id, attendances);
    res.status(200).json();
  } catch (error) {
    res.status(403).json(error.message);
  }
}


/**
 * Controller method to ge the attendances of a class session in 
 * range of dates.
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
exports.getAttendancesByDates = async(req, res) => {
  try {
    const { class_id, professor_id, begining, end} = req.query;

    console.log(class_id, professor_id, begining, end);
    
    const attendances = await classSessionReposistory.
      getAttendancesByDates(class_id, professor_id, begining, end);
    
      res.status(200).json(attendances);
  } catch (error) {
    res.status(403).json(error.message);
  }
}




