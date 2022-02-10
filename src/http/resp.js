import ElementUI from 'element-ui';
import router from '../router';

/* global Promise */
const getMsg = () => {
  let msg = '';

  msg = msg.toString();

  return msg;
};



export default {
  async successCall(resp) {

    const response = resp.data;
    if(!response.success){
      // token 過期
      if(response.errorCode == '1001104'){
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userToken');
        router.push('/login', () => {
          ElementUI.Notification.warning({
            message: response.errorMsg
          });
        });
      }
      else{
        ElementUI.Notification.error({
          message: response.errorMsg
        });
      }
    }
    return resp;

  },
  async failureCall(err) {
    console.log(err);
    return Promise.reject(err);

  },
};
