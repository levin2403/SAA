const attendanceModel = require('../models/classSession.model');

/**
 * Get the class atendance of a specific date
 * @param {String} classId
 * @param {Date} date 
 */
exports.getAttendance = async(classId, professorId, date) =>
{
    try{
        // Normalize the date to start of day for accurate comparison
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await attendanceModel.findOne({
            classId: classId,
            professorId: professorId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        return attendance;
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
 * especified in the two arguments
 * 
 * @param {String} classId
 * @param {String} professorId
 * @param {Date} begining 
 * @param {Date} end 
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
        }).sort({ date: 0 }); // Sort by date descending

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
 * @param {Object} attendance - Should contain classId, professorId, date, and attendances array
 */
exports.insertAttendance = async(attendance) =>
{
    try{
        const newAttendance = new attendanceModel({
            classId: attendance.classId,
            professorId: attendance.professorId,
            date: attendance.date,
            attendances: attendance.attendances || []   
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
 * Changes the assistence state of a certain user in the specified attendance
 * @param {String} attendanceId 
 * @param {String} studentId 
 * @param {String} state 
 */
exports.changeAssistenceState = async(attendanceId, studentId, status) =>
{
    try{
        // Use MongoDB's array update operator to update the student's status
        const updatedAttendance = await attendanceModel.findOneAndUpdate(
            { 
                _id: attendanceId,
                'attendances.studentId': studentId 
            },
            {
                $set: { 
                    'attendances.$.status': status,
                    'attendances.$.updatedAt': new Date()
                } 
            },
            { new: true } // Return the updated document
        );

        if (!updatedAttendance) {
            throw new Error('Attendance record or student not found');
        }

        return updatedAttendance;
    }
    catch(error){
        console.log(
            'An error ocurred while changing the assistance status', 
            error.message
        );
        throw error;
    }
}




