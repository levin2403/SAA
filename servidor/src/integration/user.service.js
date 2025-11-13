const axios = require('axios');

class ExternalApiService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000/',
      timeout: 5000, // 500ms
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getProfessorClasses(professorId) {
    try {
      const response = await this.api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error.message);
      throw new Error('No se pudo conectar con la API externa');
    }
  }

  async getUserById(userId) {
    try {
      const response = await this.api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el usuario:', error.message);
      throw new Error('No se pudo obtener el usuario desde la API externa');
    }
  }
}

module.exports = new ExternalApiService();
