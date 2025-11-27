import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.0/+esm';

export default class UsersService {
  constructor(baseURL = 'http://localhost:3000') {
    this.api = axios.create({
      baseURL,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async getStudentClasses(studentId) {
    try {
      const response = await this.api.get('/student/classes/', {
        params: { student_id: studentId }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching student classes:", error);
      this.handleError(error);
    }
  }

  async getProfessorClasses(professorId) {
    try {
      const response = await this.api.get('/professor/classes/', {
        params: { professor_id: professorId }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching professor classes:", error);
      this.handleError(error);
    }
  }

  // Helper para procesar el mensaje de error correctamente
  handleError(error) {
    let message = 'Error desconocido al obtener datos';
    
    if (error.response && error.response.data) {
      // Si el servidor envió un JSON con detalle del error
      const data = error.response.data;
      message = data.message || data.error || JSON.stringify(data);
    } else if (error.message) {
      message = error.message;
    }

    throw new Error(message);
  }
}