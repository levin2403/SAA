const axios = require('axios');

class ExternalApiService {
  constructor() 
  {
    this.api = axios.create(
    {
      baseURL: 'http://localhost:3000/',
      timeout: 5000, // 500ms
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  }

  /**
   * Call to the external API to validate the user credentials for the 
   * login.
   * @param {String} userId
   * @param {String} password
   * @returns A user object with necessary user data.
   */
  async validateUserCredentials(userId, password)
  {
    try 
    {
      const response = await this.api.post('users/validate_credentials/',
        {
          user_id: userId,
          password: password
        }
      );
      return response.data; 
    } 
    catch (error)
    {
      console.error('An error ocurred while validating the credentials: ', error.message);
      const backendErrorMessage = error.response?.data;
      throw new Error(backendErrorMessage);
    }
  }

  /**
   * Call to the external API to request all students that
   * belong to a certain class.
   * @param {String} professorId 
   * @returns 
   */
  async getStudentsByClassId(classId) 
  {
    try 
    {
      console.log(classId);
      const response = await this.api.get('classes/students/', {
        params: { class_id: classId }
      });
      return response.data;
    } catch (error) 
    {
      console.error('Error al obtener usuarios:', error.message);
      const backendErrorMessage = error.response?.data;
      throw new Error(backendErrorMessage);
    }
  }

  /**
   * Call to the external API to request all classes that a student
   * belongs.
   * @param {String} studentId 
   * @returns Object array with the corresponding user clases.
   */
  async getStudentClassesById(studentId) 
  {
    try 
    {
      const response = await this.api.get('student/classes/', {
        params: { student_id: studentId }
      });
      return response.data;
    } catch (error) 
    {
      console.error('An error has ocurred while consulting a user clases:', error.message);
      const backendErrorMessage = error.response?.data;
      throw new Error(backendErrorMessage);
    }
  }

  /**
   * Call to the external API to request all classes that a professor
   * belongs.
   * @param {String} userId 
   * @returns Object array with the corresponding teacher clases.
   */
  async getProfessorClassesById(teacherId) 
  {
    try 
    {
      const response = await this.api.get('professor/classes/', {
        params: { professor_id: teacherId }
      });
      return response.data;
    } catch (error) 
    {
      console.error('An error has ocurred while consulting a professor clases:', error.message);
      const backendErrorMessage = error.response?.data;
      throw new Error(backendErrorMessage);  
    }
  }

/**
   * Call to the external API to request all classes that a teacher
   * belongs.
   * @param {String} userId 
   * @returns Object array with the corresponding teacher clases.
   */
async getProfessorClassesDays(classId) 
{
  try 
  {
    const response = await this.api.get('professor/classes/days/', {
      params: { classId: professorId }
    });
    return response.data;
  } catch (error) 
  {
    console.error('An error has ocurred while consulting a user clases:', error.message);
    const backendErrorMessage = error.response?.data;
    throw new Error(backendErrorMessage);
  }
}

}


module.exports = new ExternalApiService();
