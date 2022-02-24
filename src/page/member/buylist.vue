<template lang="pug">
  div
    div(class="search-group")
      h2(class="search-item") 訂單狀態查詢
      el-select(class="search-item" v-model="search.status" @change="getBuylist()")
        el-option(:key="item.key" 
                  :label="item.label" 
                  :value="item.value" 
                  v-for="item in statusOptions")
    el-result(class="no-result" v-if="buylist.length == 0" icon="warning" title="尚未有訂單")
    div(class="buylist-div")  
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
                    el-tag(v-if="item.status == -1" type="danger") 訂單已取消
                    el-tag(v-if="item.status == 0" ) 訂單處理中
                    el-tag(v-if="item.status == 1" type="warning") 寄送中
                    el-tag(v-if="item.status == 2" type="success") 已完成

              el-table(:data="item.buylistDetail")
                el-table-column(label="商品名稱" prop="product.name")
                el-table-column(label="單價" prop="oneProductPrice")
                el-table-column(label="訂購數量" prop="amount")
              el-button(class="cancel-btn" 
                        v-if="item.status != -1"
                        type="danger" 
                        :disabled="item.status>=1" 
                        @click="cancel(item.id)") 取消訂單
        H1(v-if="nowLoading") 加載中。。。。。
</template>
<script>
import ElementUI from 'element-ui';
import userApi from '@/api/user';
import transactionApi from '@/api/transaction';

const statusOptions = [
  { label:'全部', value: null },
  { label: '處理中', value: 0 },
  { label: '寄送中', value: 1 },
  { label: '已完成', value: 2 },
  { label: '已取消', value: -1 },
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
          pageSize: 3,
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
      },
      nowLoading(){
        return this.loading
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
          this.getBuylist(true);
        }
      },
      getBuylist(loadMore){
        const sendData = {
          userId: Number(sessionStorage.getItem('userId')),
          status:this.search.status,
          page: this.page.currentPage,
          pageSize: this.page.pageSize,
          sortCol: this.sortData.column,
          sortOrder: this.sortData.order,
        }

        userApi.getBuylist(sendData).then((res) => {
          
          const apiRes = res.data;
          if(apiRes.success){

            setTimeout(() => {
            if(loadMore){
                apiRes.data.content.forEach(item => {
                  this.buylist.push(item);
                });
              } else {
                this.buylist = apiRes.data.content;
              }
              this.loading = false;
            }, 500);
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
            
          }
          this.getBuylist();
        })

      }
    }
  }
</script>

<style lang="scss" scoped>

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
.no-result{
  height: calc(100% - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.buylist-div{
  height: calc(100% - 50px);
  padding:20px;
  box-sizing: border-box;
}
.buylist {
  //background: #e3fcfc;
  height: 100%;
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


</style>