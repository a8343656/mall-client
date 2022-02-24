import http from '@/http/http';


export default {
  buy(sendData) {
    return http.post('/transaction/buy', sendData);
  },
  cancelOrder(sendData) {
    return http.post('/transaction/cancelOrder', sendData);
  },
};
