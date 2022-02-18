<template lang="pug">
  div(class="all")
    // 上方按鈕區
    div(class="topbar")
      router-link( class="button", to="/")
        el-button 回首頁

      router-link(class="button", to="/product/shopping_car")
        el-button 購物車

      el-button(class="button", @click="logout()" ) 登出

    // 左側導航用的 sidebar
    el-menu(class = "sidebar", background-color="#545c64", text-color="#fff", router)
      el-menu-item(index="/member/member/member_data", :key="1", )
        i(class="el-icon-user")
        span(slot="title") 會員資料

      el-menu-item(index="/member/member/buylist", :key="2", )
        i(class="el-icon-box")
        span(slot="title") 訂單管理

      // 中央顯示區域  v-loading="showLoading"
    div(class="right-context")
      div(v-loading.fullscreen="getLoading" class="show-div")
        router-view
</template>
<script>
import ElementUI from 'element-ui';
import router from '@/router'

export default ({
  computed: {
    getLoading() {
      return this.$store.getters['loading'];
    },
  },
  methods: {
    logout() {
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userToken');
      ElementUI.Notification.success({
        message: '已登出',
      });
      router.push('/');
    },
  },
});

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

.sidebar {
  float: left;
  width: 20%;
  height: 93vh;
}
.right-context {
  float: right;
  width: 80%;
  height: 93vh;

  .show-div {
    margin: 15px 0px 0px 15px;
  }

}

</style>
