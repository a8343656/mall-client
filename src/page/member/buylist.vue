<template lang="pug">
  div
    div(class="search-group")
      h2(class="search-item") 訂單狀態查詢
      el-select(class="search-item" v-model="search.status")
        el-option(:key="item.key" :label="item.label" :value="item.value" v-for="item in statusOptions")
      el-button(class="search-item") 搜尋
      
    div(class="buylist" v-infinite-scroll="load" infinite-scroll-disabled="scrollDisabled" )
      ul
        li(v-for="item in buylist" :key="item.id" )
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
            el-button(class="cancel-btn" 
                      type="danger" 
                      :disabled="item.status>=1 || item.status == -1" 
                      @click="cancel(item.id)") 取消訂單

</template>
<script>
import ElementUI from 'element-ui';
import userApi from '@/api/user';
import transactionApi from '@/api/transaction';

const statusOptions = [
  { key:0, label:'全部', value: null },
  { key:1, label: '處理中', value: 0 },
  { key:2, label: '寄送中', value: 1 },
  { key:3, label: '已完成', value: 2 },
  { key:4, label: '已取消', value: 3 },
];

export default {
    data() {
      return {
        buylist:[],
        search:{
          status:null,
        },
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
        statusOptions,
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
      setLoading(status) {
      this.$store.dispatch('setLoading', status);
      },
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
        this.setLoading(true);
        userApi.getBuylist(sendData).then((res) => {

          this.setLoading(false);
          const apiRes = res.data;
          if(apiRes.success){
            apiRes.data.content.forEach(item => {
              this.buylist.push(item);
            });
            this.page.totalPage = apiRes.data.totalPages;
          }

        })
      },
      cancel(orderId){
        const sendData = {
          userId: Number(sessionStorage.getItem('userId')),
          orderId: orderId,
        }

        this.setLoading(true);

        transactionApi.cancelOrder(sendData).then((res) =>{

          this.setLoading(false);
          const apiRes = res.data;
          if(apiRes.success){
            ElementUI.Notification.success({
              message: '取消成功',
            });
            this.buylist();
          }
        })

      }
    }
  }
</script>

<style lang="scss" scoped>
.all{
  .search-group{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 50px;
    margin-bottom: 10px;
    .search-item{
      margin-right: 10px;
    }
  }
  .buylist {
    background: #e3fcfc;
    height: calc(100% - 30px);
    overflow-y: auto;
    padding: 10px;
    box-sizing: border-box;
    
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
}

</style>