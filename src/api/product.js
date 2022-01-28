import http from '@/http/http';


export default {
  getProductList(sendData) {
    return http.get('/product/getProductList', sendData);
  },
  getProductDetail(sendData) {
    return http.get('/product/getProductDetail', sendData);
  },
  addToShoppingCar(sendData) {
    return http.post('/product/addToShoppingCar', sendData);
  },
};
