
/* global Promise */
const getMsg = () => {
  let msg = '';

  msg = msg.toString();

  return msg;
};



export default {
  async successCall(resp) {

    console.log(resp);
    return resp;

  },
  async failureCall(err) {

    console.log(err);
    return Promise.reject(err);

  },
};
