const classSessionReposistory = require('../repositories/classSession.repository');
const userService = require('../integration/user.service');

/**
 * 
 * @param {String} classId
 * @param {String} professorId
 * @param {String} date
 * @returns 
 */
exports.getClassSession = async(classId, professorId, date) => 
{
    try{
        //verify if the given date es between the semester limits
        verifyDateIsInSemester(date);

        //get the attendance from the database
        const classSession = await getClassSession(classId, professorId, date);

        //if the class attendance of the day doesnt exist make a new one.
        if (!classSession){
            const newClassSession = await createNewClassSession(classId, professorId, date);
            return newClassSession;
        }

        return classSession; //case the attendance exist return
    }
    catch(error){
        throw new Error(error.message); // General generic error
    }
}

function verifyDateIsInSemester(date){
    const givenDate = new Date(date)
    givenDate.setUTCHours(14, 0, 0, 0)
    console.log(givenDate)

    semesterStartDate = new Date('2025-08-25')
    console.log(semesterStartDate)

    semesterEndDate = new Date('2025-12-13')
    console.log(semesterEndDate)


    if(givenDate < semesterStartDate || givenDate > semesterEndDate){
        throw new Error('La fecha esta fuera del rango del periodo actual.')   
    }
}

/**
 * 
 * @param {String} classId 
 * @param {String} professorId 
 * @param {Date} date 
 * @returns 
 */
async function getClassSession(classId, professorId, date){
    try{
        return await classSessionReposistory.getClassSession(classId, professorId, date);
    }
    catch(error){
        throw new Error('Error al obtener la asistencia del dia') //Generic error
    }
}

/**
 * 
 * @param {String} classId 
 * @param {String} professorId 
 * @param {Date} date 
 * @returns 
 */
async function createNewClassSession(classId, professorId, date) {
    try{

        //get the days that the class is imparted
        const days = await getProfessorDayClasses(classId); 

        //verify if the session to create is in a valid day
        const dayVerification = await verifyDayOfCreationIsValid(days.days, date);
        if(!dayVerification){
            return null;
        }
        
        const classStudents = await getStudentsInClass(classId);

        //creating a new session
        const newClassSession = await createClassSession(classId, professorId, classStudents, date);
        return newClassSession;
    }
    catch(error){
        throw error.message; //Generic error
    }
}  


/**
 * Helper function to seek for the classes that the class is imparted
 * in the extarnal API.
 * 
 * @param {String} classId 
 * @returns Array with the days that the class is imparted.
 */
async function getProfessorDayClasses(classId){
    try{
        return await userService.getProfessorClassesDays(classId);
    }
    catch(error){
        throw new Error('Error al obtener la asistencia del dia'); //Generic error
    }
}

/**
 * Compare if the current day is a day that the class is imparted
 * to know if its correct to create a new class session.
 * 
 * @param {Array} days Strings array with the names of the 
 * days that the professor imparts the class. 
 */
async function verifyDayOfCreationIsValid(days, dateString) {
    const dayToCreate = new Date(dateString);
    dayToCreate.setUTCHours(14, 0, 0, 0);

    const daysNames = {
        "Lunes": 1,
        "Martes": 2,  
        "Miercoles": 3,
        "Jueves": 4,
        "Viernes": 5,
        "Sabado": 6,
        "Domingo": 0
    };

    return days.some(day => {
        const dayNumber = daysNames[day];
        return dayNumber === dayToCreate.getDay();
    });
}



/**
 * 
 * @param {*} classId 
 * @returns 
 */
async function getStudentsInClass(classId){
    try{
        return await userService.getStudentsByClassId(classId);
    }
    catch(error){
        throw new Error('Error al obtener la asistencia del dia'); //Generic error
    }
}

/**
 * 
 * @param {*} classId 
 * @param {*} professorId 
 * @param {*} classStudents 
 */
async function createClassSession(classId, professorId, classStudents, date) {
    try{
        const classSession = {
            'classId' : classId,
            'professorId': professorId,
            'date': date,
            'students': classStudents.students
        }

        return await classSessionReposistory.insertClassSession(classSession);
    }
    catch(error){
        throw new Error('Error al obtener la asistencia del dia'); //Generic error
    }
}



