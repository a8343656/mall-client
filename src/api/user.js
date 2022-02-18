import http from '@/http/http';


export default {
  getMemberData(sendData) {
    return http.post('/user/getMemberData', sendData);
  },
  changeMemberData(sendData) {
    return http.put('/user/changeMemberData', sendData);
  },
  changePws(sendData) {
    return http.put('/user/changePws', sendData);
  },
  getShoppingCarList(sendData) {
    return http.post('/user/getShoppingCarList', sendData);
  },
  getOrderList(sendData) {
    return http.post('/user/getOrderList', sendData);
  },
  addToShoppingCar(sendData) {
    return http.post('/user/addToShoppingCar', sendData);
  },
  removeFromShoppingCar(sendData) {
    return http.delete('/user/removeFromShoppingCar', {data:sendData});
  },
};
