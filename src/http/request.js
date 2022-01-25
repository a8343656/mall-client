export default {
  async successRequest(request) {
    request.headers.userId = sessionStorage.getItem('userId');
    request.headers.userToken = sessionStorage.getItem('userToken');

    return request;
  },
  /* global Promise */
  async errRequest(err) {
    return Promise.reject(err);
  },
};
