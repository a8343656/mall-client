import http from '@/http/http';


export default {
  getProductList(sendData) {
    return http.get('/product/getProductList', {params: { page: sendData.page }});
  },
  getProductDetail(id) {
    return http.get('/product/getProductDetail', {params: { id: id }});
  },
  addToShoppingCar(sendData) {
    return http.post('/product/addToShoppingCar', sendData);
  },
};
