import ElementUI from 'element-ui';

/* global Promise */
const getMsg = () => {
  let msg = '';

  msg = msg.toString();

  return msg;
};



export default {
  async successCall(resp) {

    const response = resp.data;
    if(!response.sucess){
      ElementUI.Notification.error({
        message: response.errorMsg
      });
    }
    return resp;

  },
  async failureCall(err) {

    console.log(err);
    return Promise.reject(err);

  },
};
