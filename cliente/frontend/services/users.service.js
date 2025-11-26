import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.0/+esm';

export default class UsersService {
  constructor(baseURL = 'http://localhost:3001') {
    this.api = axios.create({
      baseURL,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * REST Client to retrive the classes that a user belongs to.
   * @param {String} studentId Studen identifier.
   * @returns Array with the student classes.
   */
  async getStudentClasses(studentId) 
  {
    try{
      const response =  await this.api.get('/student/classes/', {
        params: {
          student_id: studentId
        }
      })
      return response.data.classes
    }catch(error){
      const errorMessage = error.response?.data;
      throw new Error(errorMessage || 'Error al obtener las clases');
    }
  }

  /**
   * REST Client to retrive the classes that a professor belongs to.
   * @param {String} professorId Professor identifier.
   * @returns Array with the classes that the professor imparts.
   */
  async getProfessorClasses(professorId) 
  {
    try{
      const response = await this.api.get('/professor/classes/', {
        params: {
          professor_id: professorId
        }
      })
      return response.data.classes
    }catch(error){
      const errorMessage = error.response?.data;
      throw new Error(errorMessage || 'Error al obtener las clases');
    }
  }
}



