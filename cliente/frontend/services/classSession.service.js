import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.0/+esm';

export default class  ClassSessionService {
  
  constructor(baseURL = 'http://localhost:3001'){
    this.api = axios.create({
      baseURL,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });  
  }

  /**
   * GET /class/session
   * @param {{ class_id: string, professor_id: string, date: string }} params
   */
  async getClassSession(classId, professorId, date){
    try{
      const response =  await this.api.get('/class/session/', {
        params: {
          class_id: classId,
          professor_id: professorId,
          date: date
        }
      })
      return response.data
    }catch(error){
      const errorMessage = error.response?.data;
      throw new Error(errorMessage || 'Error al obtener las clases');
    }
  }

  /**
   * PUT /update/attendance
   * @param {String} classSessionId 
   * @param {String} updatedAttendance 
   * @returns 
   */
  async updateAttendance(classSessionId, updatedAttendance){
    try{
      await this.api.put('/update/attendance/',
       {
          class_session_id: classSessionId,
          attendances: updatedAttendance
        }
      )
    }catch(error){
      const errorMessage = error.response?.data;
      throw new Error(errorMessage || 'Error al guardar las asistencias, intente de nuevo');
    }
  }

  /**
   * GET /attendances/dates
   * @param {{ class_id: string, professor_id: string, begining: string, end: string }} params
   */
  getAttendancesByDates(params = {}, config = {}){
    return this.api.get('/attendances/dates', { ...config, params }).then(res => res.data);
  }
}

