import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.0/+esm';

export default class UsersService {
  constructor(baseURL = 'http://localhost:3001') {
    this.api = axios.create({
      baseURL,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getStudentClasses(params = {}, config = {}) {
    return this.api.get('/student/classes', { ...config, params })
      .then(res => res.data);
  }

  getProfessorClasses(params = {}, config = {}) {
    return this.api.get('/professor/classes', { ...config, params })
      .then(res => res.data);
  }
}


