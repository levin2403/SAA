const classSessionReposistory = require('../repositories/classSession.repository');
const userService = require('../integration/user.service');

exports.getClassSession = async(classId, professorId, date) => 
{
    try{
        const attendance = classSessionReposistory.
            getAttendance(classId, professorId, date);

        //if the class attendance of the day doesnt exist make a new one.
        if (!attendance){
            const newAttendance = createNewAttendance(classId, professorId, date);
            return newAttendance;
        }
        return attendance;
    }
    catch(error){
        throw new Error(error.message);
    }
}

async function createNewAttendance(classId, professorId, date) {
    try{
        //to do
        if(!verifyDayOfCreation(days)) return null;
    }
    catch(error){
        throw new Error(error.message);
    }
}

/**
 * Compare if the current day is a day that the class is imparted
 * to know if its correct to create a new class session.
 * 
 * @param {Array} days Strings array with the names of the 
 * days that the professor imparts the class. 
 */
async function verifyDayOfCreationIsValid(days) {

    const currentDay = new Date().getDay(); 

    const daysNames = {
        "Lunes": 1,
        "Martes": 2,
        "Miercoles": 3,
        "Jueves": 4,
        "Viernes": 5,
        "Sabado": 6
    };

    return days.some(day => {
        const dayNumber = daysNames[day];
        return dayNumber === currentDay;
    });
}


async function getProfessorDayClasses(){
    
}



