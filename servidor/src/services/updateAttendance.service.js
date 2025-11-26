const classSessionReposistory = require('../repositories/classSession.repository');

/**
 * Based on an input array of attendances wich contains name, id of 
 * the user and status (PRESENT, ABSENT), updates the lis of attendences 
 * of the class session, 
 * 
 * @param {String} classSessionId 
 * @param {Array} attendances 
 */
exports.uptdateAttendance = async(classSessionId, attendances) =>
{
    try{
        if(!attendances || !classSessionId) 
            throw new Error('Error al guardar las asistencias, intente de nuevo');
        
        await classSessionReposistory.updateAttendences(classSessionId, attendances);
    }
    catch(error){
        throw new Error(error.message) //General generic error
    }
}
