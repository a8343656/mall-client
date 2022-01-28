import http from '@/http/http';


export default {
  login(sendData) {
    return http.post('/auth/login', sendData);
  },
  logout() {
    return http.post('/auth/logout');
  },
  register(sendData) {
    return http.post('/auth/register',sendData);
  }
};
