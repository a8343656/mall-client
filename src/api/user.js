import http from '@/http/http';


export default {
  getUserData(sendData) {
    return http.post('/user/getUserData', sendData);
  },
  changeUserData(sendData) {
    return http.put('/user/changeUserData', sendData);
  },
  changePws(sendData) {
    return http.put('/user/changePws', sendData);
  },
  getShoppingCarList(sendData) {
    return http.post('/user/getShoppingCarList', sendData);
  },
  getBuylist(sendData) {
    return http.post('/user/getBuylist', sendData);
  },
  addToShoppingCar(sendData) {
    return http.post('/user/addToShoppingCar', sendData);
  },
  removeFromShoppingCar(sendData) {
    return http.delete('/user/removeFromShoppingCar', {data:sendData});
  },
};
