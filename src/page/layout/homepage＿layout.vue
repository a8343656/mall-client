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

      router-link( v-show ="isLogin", class="button", to="/product/shopping_car")
        el-button 購物車

      router-link( v-show ="isLogin", class="button", to="/member")
        el-button 會員專區

      el-button(class="button", v-show ="isLogin", @click="logout" ) 登出

    div(v-loading="getLoading")
      router-view(class="rounter-context")
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
      localStorage.removeItem('userId');
      localStorage.removeItem('userToken');
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
      if (localStorage.getItem('userId')) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.all{
  height: 100vh;
}
.topbar {
  position: sticky;
  background: #2c3e50;
  height: 70px;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  .button {
    margin: 0px 20px 0px 20px ;

  }
}

.rounter-context {
  width: 100%;
  overflow-y: auto;
  height: calc(100vh - 70px);
}
</style>
