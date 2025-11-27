import { API_URL } from "../globals/class.globals.js";

export default class ClassSessionService {

  /**
   * Obtiene la sesión de clase para una fecha específica.
   * Usado en: attendance.controller.js
   */
  async getClassSession(classId, professorId, date) {
    try {
      const url = `${API_URL}/class/session?class_id=${classId}&professor_id=${professorId}&date=${date}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        // Si el servidor devuelve 404, retornamos null para indicar que no hay sesión
        if(response.status === 404) return null;
        
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener la sesión');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Service Error (getClassSession):", error);
      throw error;
    }
  }

  /**
   * Actualiza o crea la asistencia.
   * Usado en: attendance.controller.js
   */
  async updateAttendance(classSessionId, attendances) {
    try {
      const response = await fetch(`${API_URL}/update/attendance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_session_id: classSessionId,
          attendances: attendances
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar asistencia');
      }

      return await response.json();
    } catch (error) {
      console.error("Service Error (updateAttendance):", error);
      throw error;
    }
  }

  /**
   * Obtiene reporte de asistencias por rango.
   * Usado en: reports.controller.js
   */
  async getAttendancesByRange(classId, professorId, startDate, endDate) {
    try {
      const url = `${API_URL}/attendances/dates?class_id=${classId}&professor_id=${professorId}&begining=${startDate}&end=${endDate}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        // Manejo silencioso si no hay datos
        if(response.status === 404) return [];
        
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener reporte');
      }

      return await response.json();
    } catch (error) {
      console.error("Service Error (getAttendancesByRange):", error);
      throw error;
    }
  }
}