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
      const response = await this.api.post('/users/validate_credentials/', {
        data: {
          user_id: userId,
          password: password
        }
      });
      return response.data;
    } 
    catch (error)
    {
      console.error(
        'An error ocurred while validating the credentials', 
        error.message
      );
      throw new Error();
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
      const response = await this.api.get('/classes/students/', {
        data: {
          class_id: classId
        }
      });
      return response.data;
    } catch (error) 
    {
      console.error('Error al obtener usuarios:', error.message);
      throw new Error();
    }
  }

  /**
   * Call to the external API to request all classes that a user
   * belongs.
   * @param {String} userId 
   * @returns Object array with the corresponding user clases.
   */
  async getUserClassesById(userId) 
  {
    try 
    {
      const response = await this.api.get('/users/classes', {
        data: {
          user_id: userId
        }
      });
      return response.data;
    } catch (error) 
    {
      console.error('An error has ocurred while consulting a user clases:', 
        error.message
      );
      throw new Error();
    }
  }

}

module.exports = new ExternalApiService();
