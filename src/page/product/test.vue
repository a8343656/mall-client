<template lang="pug">
  div(class="buylist")
    ul(v-infinite-scroll="load" infinite-scroll-disabled="scrollDisabled")
      li(v-for="item in buylist" :key="item.id")
        el-card
          div
            div(class="top-describe")
              div
                p 訂單編號:{{item.id}}
              div
                H2 總金額:{{item.totalPrice}}
                el-tag(v-if="item.status == -1") 訂單已取消
                el-tag(v-if="item.status == 0") 訂單處理中
                el-tag(v-if="item.status == 1") 寄送中
                el-tag(v-if="item.status == 2") 已完成
            
          el-table(:data="item.buylistDetail")
            el-table-column(label="商品名稱" prop="product.name")
            el-table-column(label="單價" prop="oneProductPrice")
            el-table-column(label="訂購數量" prop="amount")
          el-button(class="cancel-btn" type="danger" :disabled="item.status>=1") 取消訂單

</template>
<script>
import userApi from '@/api/user';

export default {
    data() {
      return {
        buylist:[],
        page:{
          currentPage: 1,
          pageSize: 2,
          totalPage:0,
        },
        sortData: {
        column: 'updateTime',
        order: 'DESC',
        },
        loading:false,
      };
    },
    computed:{
      scrollDisabled(){
        // 正在 loading 或者沒有更多資料時禁用 scroll
        return this.loading || this.page.currentPage >= this.page.totalPage
      }
    },
    created() {
      this.getBuylist();
    },
    methods: {
      load(){
        if(this.page.currentPage < this.page.totalPage){
          this.loading = true;
          this.page.currentPage ++;
          this.getBuylist();
          this.loading = false;
        }
      },
      getBuylist(){
        const sendData = {
          userId: Number(sessionStorage.getItem('userId')),
          page: this.page.currentPage,
          pageSize: this.page.pageSize,
          sortCol: this.sortData.column,
          sortOrder: this.sortData.order,
        }
        userApi.getBuylist(sendData).then((res) => {
          const apiRes = res.data;
          if(apiRes.success){
            apiRes.data.content.forEach(item => {
              this.buylist.push(item);
            });
            this.page.totalPage = apiRes.data.totalPages;
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.buylist {
  height: 100vh;
  overflow-y: auto;
  ul{
    list-style-type: none;
    padding:0;
    li{
      margin-bottom:10px;
      .top-describe{
      display: flex;
      justify-content:space-between;
      align-items: center;
      height: 120px;
      }
      .cancel-btn{
        margin: 20px;
        float: right;
      }
    }
    
  }
}
</style>