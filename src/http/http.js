import axios from 'axios';
import Response from './resp';
import Request from './request';

const Http = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  baseURL: 'http://localhost:8081'
});

Http.interceptors.request.use(Request.successRequest, Request.errRequest);
Http.interceptors.response.use(Response.successCall, Response.failureCall);

export default Http;
