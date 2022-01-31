<template lang="pug">
  div(class="all")
    div(class="register-form")
      el-form(ref="formRef" :model="user" :rules="rules",label-position="right", label-width="90px")

        el-form-item(label="帳號" prop="account")
          el-input(class="input" v-model="user.account")

        el-form-item(label="密碼" prop="password")
          el-input( class="input" v-model="user.password" show-password)

        el-form-item(label="姓名" prop="name")
          el-input( class="input" v-model="user.name")

        el-form-item(label="地址" prop="address")
          el-input(  v-model="user.address")

      div(class="button-group")
        el-button(type="primary" @click="onSubmit" :loading="registerButtonLoading") 註冊
        el-button(type="primary" style="margin-left: 10px" @click="cancel") 取消
</template>

<script>
import ElementUI from 'element-ui';
import authApi from '@/api/auth';

const rules = {
  account: [{ required: true, whitespace: true, message: '請輸入帳號' }],
  password: [{ required: true, whitespace: true, message: '請輸入密碼' }],
  name: [{ required: true, whitespace: true, message: '請輸入姓名' }],
  address: [{ required: true, whitespace: true, message: '請輸入地址' }],
};

export default {
  data() {
    return {
      user: {
        account: '',
        password: '',
        name: '',
        address: '',
      },
      rules,
      registerButtonLoading: false,
    };
  },
  methods: {
    onSubmit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const sendData = {
            account: this.user.account,
            password: this.user.password,
            name: this.user.name,
            address: this.user.address,
          };
          this.registerButtonLoading = true;
          authApi.register(sendData).then((res) => {
            this.registerButtonLoading = false;
            const result = res.data;

            if (result.success === true) {
              ElementUI.Notification.success({
                message: '註冊成功，跳轉至首頁',
              });
              // 註冊成功直接登入並跳轉至首頁
              sessionStorage.setItem('userId', result.data.userId);
              sessionStorage.setItem('userToken', result.data.token);
              this.$router.push('/');
            }
          });
        }
      });
    },
    cancel() {
      this.$router.push('/');
    },
  },

};
</script>
<style lang="scss" scoped>
.all {
  display: flex;
  justify-content: center;
  margin-top: 1.5%;

  .register-form {
    width: 40%;
  }
  .button-group {
    float: right;
  }

}
</style>
