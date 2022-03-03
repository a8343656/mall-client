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
    div(class="bottom")
      el-menu(class = "sidebar", background-color="#545c64", text-color="#fff", router)
        el-menu-item(index="/member/member/member_data", :key="1", )
          i(class="el-icon-user")
          span(slot="title") 會員資料

        el-menu-item(index="/member/member/buylist", :key="2", )
          i(class="el-icon-box")
          span(slot="title") 訂單管理

      // 中央顯示區域  v-loading="showLoading"
      router-view( v-loading="getLoading" class="right-context" )
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
  display: flex;
  flex-direction:column;


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
  .bottom{
    position: sticky;
    display: flex;
    flex-direction:row;
    height: calc(100vh - 70px);

    .sidebar {
      border-right-width: 0;
      width: 270px;
    }

    .right-context {
      height: calc(100% - 15px);
      width: calc(100% - 270px);
      padding: 15px;
      box-sizing: border-box;
    }
}
}




</style>
