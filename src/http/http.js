import axios from 'axios';
import Response from './resp';
import Request from './request';

const Http = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  baseURL: process.env.VUE_APP_BASE_URL
});

Http.interceptors.request.use(Request.successRequest, Request.errRequest);
Http.interceptors.response.use(Response.successCall, Response.failureCall);

export default Http;
