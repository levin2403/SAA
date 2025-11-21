import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.0/+esm';

export default class  SessionService {
  constructor(baseURL = 'http://localhost:3001'){
    this.api = axios.create({
      baseURL,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });

    //this.api.interceptors.request.use(config => {
    //  if(this.accessToken){
    //    config.headers = config.headers || {};
    //    config.headers.Authorization = `Bearer ${this.accessToken}`;
    //  }
    //  return config;
    //});
  }

  setAccessToken(token){
    this.accessToken = token || null;
  }

  /**
   * REST Client to log in a user and bring his information
   * (id, rol, name and tokens).
   * 
   * @param {String} id identificator of the user.
   * @param {String} password password of the user.
   * @returns 
   */
  async login(id, password){
    try 
    {
      const response = await this.api.post('/login/', {
          id: id,
          password: password
        }
      );
      console.log(response.data);
      return response.data; 
    } 
    catch (error)
    {
      const errorMessage = error.response?.data;
      throw new Error(errorMessage || 'Error al iniciar sesion intente de nuevo');
    }
  }

  /**
   * 
   * @param {*} payload 
   * @param {*} config 
   * @returns 
   */
  refreshToken(payload, config = {}){
    return this.api.post('/refresh_token', payload, config).then(res => res.data);
  }

  /**
   * REST Client to close a session in the server.
   * 
   * @param {String} id identificator of the user.
   * @param {*} refreshToken refresh token of the session.
   * @returns 
   */
  async singleDeviceLogout(id, refreshToken)
  {
    try{
        return await this.api.delete('/single_logout/', {
          data: { 
            id: id,
            refresh_token: refreshToken
          }
        });
    }
    catch(error){
      const errorMessage = error.response?.data;
      throw new Error(errorMessage || 'Error al intentar cerrar sesion intente de nuevo');
    }
  }
}