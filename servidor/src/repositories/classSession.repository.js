const attendanceModel = require('../models/classSession.model');

/**
 * Get the class atendance of a specific date
 * @param {String} classId
 * @param {Date} date 
 */
exports.getClassSession = async(classId, professorId, date) =>
{
    try{
        // Normalize the date to start of day for accurate comparison
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const classSession = await attendanceModel.findOne({
            classId: classId,
            professorId: professorId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        return classSession;
    }
    catch(error){
        console.log(
            'An error ocurred while getting the attendance of a day', 
            error.message
        );
        throw error;
    }
}
   
/**
 * Gets the atendances that exist between the two dates
 * especified in the two arguments.
 * 
 * @param {String} classId id of the class.
 * @param {String} professorId id of the professor.
 * @param {Date} begining Starting date of the range.
 * @param {Date} end Ending date of the range.
 */
exports.getAttendancesByDates = async(classId, professorId, begining, end) =>
{
    try{
        const startDate = new Date(begining);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        const attendances = await attendanceModel.find({
            classId: classId,
            professorId: professorId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }, {_id: 0, date: 1, attendances: 1}).sort({ date: 1 }); // Sort by date descending

        return attendances;
    }
    catch(error){
        console.log(
             'An error ocurred while getting the attendances in a range of dates',
            error.message
        );
        throw error;
    }
}

/**
 * Inserts an attendance in the database.
 * @param {Object} classSession
 */
exports.insertClassSession = async(classSession) =>
{
    try{
        const newAttendance = new attendanceModel({
            classId: classSession.classId,
            professorId: classSession.professorId,
            date: new Date(classSession.date),
            attendances: classSession.students || []   
        });

        const savedAttendance = await newAttendance.save();
        return savedAttendance;
    }
    catch(error){
        console.log(
            'An error ocurred while inserting the attendance', 
            error.message
        );
        throw error;
    }
}

/**
 * Updates the attendances array for a specific class session
 * @param {String} classSessionId 
 * @param {Array} attendances - Array of attendance records
 * @returns {Object|null} - The updated class session document or null if not found
 */
exports.updateAttendences = async(classSessionId, attendances) =>
{
    try{
        // Use MongoDB's findOneAndUpdate to update and return the updated document
        await attendanceModel.findOneAndUpdate(
            { 
                _id: classSessionId
            },
            { $set: { attendances: attendances } }
        );
    }
    catch(error){
        console.log(
            'An error ocurred while changing the assistance status', 
            error.message
        );
        throw error;
    }
}




