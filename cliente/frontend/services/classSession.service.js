import { API_URL } from "../globals/class.globals.js";

class ClassSessionService {
  
  // ... otros métodos existentes ...

  /**
   * Obtiene los registros de asistencia en un rango de fechas desde el servidor.
   * @param {string} classId - ID de la materia
   * @param {string} professorId - ID del profesor
   * @param {string} startDate - Fecha inicio (YYYY-MM-DD)
   * @param {string} endDate - Fecha fin (YYYY-MM-DD)
   */
  async getAttendancesByRange(classId, professorId, startDate, endDate) {
    try {
      // Construimos la URL con los Query Params que espera tu backend (classSession.controller.js)
      const url = `${API_URL}/class/session/attendances/dates?class_id=${classId}&professor_id=${professorId}&begining=${startDate}&end=${endDate}`;
      
      const token = localStorage.getItem('token'); // Asumiendo que guardas el token al hacer login

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Si usas auth middleware
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener reporte');
      }

      return await response.json();
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    }
  }
}

export default new ClassSessionService();