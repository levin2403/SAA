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
   * 
   * @param {String} id 
   * @param {String} password 
   * @returns 
   */
  async login(id, password){
    try 
    {
      const response = await this.api.post('/login/',
        {
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
      throw new Error(errorMessage);
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
   * 
   * @param {*} payload 
   * @param {*} config 
   * @returns 
   */
  singleDeviceLogout(payload, config = {}){
    return this.api.delete('/single_logout', { ...config, data: payload }).then(res => res.data);
  }
}