<template lang="pug">
  div(class="all")
    // topbar們
    div(class="topbar")

      // 按鈕們
      router-link( class="button", :to="{name:'home', query:{ page: 1}}")
        el-button 回首頁

      router-link( v-show ="!isLogin", to="/login", class="button" ,)
        el-button 登入

      router-link( v-show ="!isLogin", to="/register", class="button")
        el-button 註冊

      router-link( v-show ="isLogin", class="button", to="/forestage/shopping_car")
        el-button 購物車

      router-link( v-show ="isLogin", class="button", to="/member")
        el-button 會員專區

      el-button(class="button", v-show ="isLogin", @click="logout" ) 登出

    div(v-loading="getLoading", class="rounter-context")
      router-view
</template>
<script>
import ElementUI from 'element-ui';

export default {
  data() {
    return {
      isLogin: false,
    };
  },
  computed: {
    getLoading() {
      return this.$store.getters['loading'];
    },
  },
  created() {
    this.CheckLogin();
  },
  methods: {
    logout() {
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userToken');
      this.isLogin = false;

      if (this.$router.currentRoute.name === 'shopping_car') {
        this.$router.push('/');
      }
      ElementUI.Notification.success({
        message: '已登出',
      });
    },
    // 因為已經在 axios 攔截器 check token ，這邊改為判斷是否有 id 就當作以登入
    CheckLogin() {
      if (sessionStorage.getItem('userId')) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  height: 100%;
}

.topbar {
  background: #2c3e50;
  width: 100%;
  height: 7vh;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  .button {
    margin: 0px 20px 0px 20px ;

  }
}

.rounter-context {

  width: 100%;
  height: 93vh;
}
</style>
