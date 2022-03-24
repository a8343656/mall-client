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
      if(response.errorCode == '1001104' || response.errorCode == '1001103'){
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userToken');
        sessionStorage.setItem('lastPage',router.currentRoute.path)
        router.push('/login', () => {
          ElementUI.Notification.warning({
            message: "閒置過久，請重新登入"
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
    if(err.response){
      const response = err.response
      
      if(response.status == 500){
        ElementUI.Notification.warning({
          message: "錯誤500，請聯繫管理員"
        });
      }
    }

    return Promise.reject(err);

  },
};
