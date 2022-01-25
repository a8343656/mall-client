import axios from 'axios';
import Response from './resp';
import Request from './request';

const Http = axios.create({
  baseURL: 'http://localhost:8080'
});

Http.interceptors.request.use(Request.successRequest, Request.errRequest);
Http.interceptors.response.use(Response.successCall, Response.failureCall);

export default Http;
