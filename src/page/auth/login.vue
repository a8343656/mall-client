<template lang="pug">
  div
    div(class="title")
      h1 使用者登入

    el-form(class="login-form" ref="loginData" :model="loginData" :rules="rules")
      div(class="input-group")
        el-form-item(label="帳號" prop="account")
          el-input(class="input" v-model="loginData.account" )

        el-form-item(label="密碼" prop="password")
          el-input(class="input" v-model="loginData.password" show-password)
        div
          el-button(class="button" type="primary" @click="logIn" :loading="loginButtonLoading") 登入
          el-button(class="button" type="primary" @click="cancel") 取消


</template>

<script>
import authApi from '@/api/auth';
// 輸入匡的驗證規則
const rules = {
  account: [{ required: true, whitespace: true, message: '請輸入帳號' }],
  password: [{ required: true, whitespace: true, message: '請輸入密碼' }],
};

export default {
  data() {
    return {
      loginData: {
        account: '',
        password: '',
      },
      rules,
      loginButtonLoading: false,
    };
  },
  methods: {
    cancel() {
      this.$router.push('/');
    },
    logIn() {
      this.$refs.loginData.validate(valid => {
        if (valid) {
          this.loginButtonLoading = true;
          authApi.login(this.loginData).then((res) => {
            const apiRes = res.data;
            if (apiRes.success) {
              sessionStorage.setItem('userId', apiRes.data.userId);
              sessionStorage.setItem('userToken', apiRes.data.token);
              this.$router.push('/');
            }
          });
        }
      });
    },
  },

};
</script>

<style lang="scss" scoped>
  .title {
    display: flex;
    justify-content: center;
    margin: 20px 0px 0px 0px ;
  }
  .login-form {
    margin: 20px 0px 0px 0px ;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .input {
      width: 190px;
    }

    .button {
      margin: 0px 10px 0px 10px;
    }
  }
</style>
