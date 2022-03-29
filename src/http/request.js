export default {
  async successRequest(request) {
    if(localStorage.getItem('userId') != null){
      request.headers.userId = localStorage.getItem('userId');
      request.headers.userToken = localStorage.getItem('userToken');
      
    }
    return request;
  },
  /* global Promise */
  async errRequest(err) {
    return Promise.reject(err);
  },
};
