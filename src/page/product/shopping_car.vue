<template lang="pug">
  div(class="all")
    div(class="top-group")
      div(class="top-button")
        el-button(:disabled="selectProductArray.length == 0" type="primary" @click="goCheckout()") 去結帳
        el-button(:disabled="selectProductArray.length == 0" @click="removeFromShoppingCar()" :loading="deleteBtnLoading") 刪除
        el-button(@click="test")
      div(class="top-total-descrip")
        H4 總共{{selectProductArray.length}}個商品
        H1 總金額{{totalPrice}}

    el-table(class="table"
            ref="shoppingCarTable"
            height="400"
            :data="shoppingCarArray"
            @selection-change="selectChange"
            @select-all="selectAllChange"
            :cell-style="{padding: '0', height: '100px'}" 
            v-el-table-infinite-scroll="load"
            infinite-scroll-disabled="scrollDisabled")
      el-table-column(label="勾選" type="selection" width="150")
      el-table-column(label="商品狀態")
        template(slot-scope="scope")
          p(class="proudct-text" v-if="scope.row.product.amount != 0 && scope.row.product.isBuyable == 1") 正常
          p(class="proudct-warn" v-if="scope.row.product.amount == 0 && scope.row.product.isBuyable != 0") 庫存不足
          p(class="proudct-warn" v-if="scope.row.product.isBuyable == 0") 商品下架中
      el-table-column(label="商品id" prop="product.id")
      el-table-column(label="庫存數量" prop="product.amount")
      el-table-column(label="單價" prop="product.price")
      el-table-column(label="購買金額" prop="buyPrice")
      el-table-column(label="購買數量" )
        template(slot-scope="scope")
          div(class="input-form")
            el-input-number(class="input" type="number"  v-model.number="scope.row.amount" @change="rowChange(scope.row)")
</template>

<script>
import router from '@/router'
import ElementUI from 'element-ui';
import userApi from '@/api/user';

export default {
  data() {
    return {
      shoppingCarArray: [],
      totalPrice: 0,
      selectProductArray: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 5,
        totalPage: 0,
        previewPage: undefined,
      },
      deleteBtnLoading: false,
      selectAll: false,
      loading: false,
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
    this.getUserShoppingCar();
  },
  methods: {
    test(){
      this.$refs.shoppingCarTable.toggleRowSelection(this.shoppingCarArray[0],true);
    },
    selectChange(selectRow){
      this.selectProductArray = selectRow;
      // 重新計算總價
      this.totalPrice = 0;
      this.selectProductArray.forEach(selectData => {
        this.totalPrice += selectData.amount * selectData.product.price;
      });
    },
    selectAllChange(selectRow){
      this.selectAll = selectRow.length != 0 
    },
    setLoading(status) {
      this.$store.dispatch('setLoading', status);
    },
    load(){
      if(this.page.currentPage < this.page.totalPage){
        this.loading = true;
        this.page.currentPage ++;
        this.getUserShoppingCar(false);
        this.loading = false;
      }
    },
    getUserShoppingCar(refreshPage) {
      this.setLoading(true);
      const sendData = {
        page: this.page.currentPage,
        pageSize: this.page.pageSize,
        userId: Number(sessionStorage.getItem('userId')),
        sortCol:"updateTime"
      };

      userApi.getShoppingCarList(sendData).then((res) => {
        const apiRes = res.data;
        if (apiRes.success) {
          const onePageData = apiRes.data.content;
          this.page.totalPage = apiRes.data.totalPages;

          // 依照 DB 的購買數量，計算出購買的金額
          onePageData.forEach(apiData =>{
            apiData.buyPrice = apiData.product.price * apiData.amount;
          })

          //判斷使用者是否全選
          if(this.selectAll){
            this.$refs.shoppingCarTable.toggleAllSelection();
          }

          // 判斷是否重load整頁的資料
          if(refreshPage){ 
            this.shoppingCarArray = onePageData;
          } else {
            onePageData.forEach(item =>{
              this.shoppingCarArray.push(item);
            })
          }

          // 若使用者是按立刻購買過來的，因為後端排序的關係會在第一筆，所以把第一筆資料勾選
          if (sessionStorage.getItem('buyNow')) {
            this.$refs.shoppingCarTable.toggleRowSelection(this.shoppingCarArray[0],true);
            sessionStorage.removeItem('buyNow');
          }
        }
        setTimeout(() => {
          this.setLoading(false);
        }, 500);
      });
    },
    removeFromShoppingCar() {
      const deletIdList = []
      this.selectProductArray.forEach(item => {
        deletIdList.push(item.productId);
      });

      const sendData = {
        userId: Number(sessionStorage.getItem('userId')),
        productIdList: deletIdList,
      };

      this.deleteBtnLoading = true;
      userApi.removeFromShoppingCar(sendData).then((res) => {
        this.deleteBtnLoading = false;
        const apiRes = res.data;

        if (apiRes.success) {
          ElementUI.Notification.success({
            message: '成功刪除',
          });
          this.selectProductArray = [];
          this.$refs.shoppingCarRef.resetFields();
        }
        this.getUserShoppingCar();
      });
    },
    rowChange(row) {
      // 呼叫更新購物車 API

      // 計算購買金額
      row.buyPrice = row.product.price * row.amount; // eslint-disable-line no-param-reassign

      // 若該行被選中
      if(this.selectProductArray.includes(row)){
        //先從 array 中移除在加入，更新購買金額
        this.selectProductArray = this.selectProductArray.filter(product => product.id !== row.id);
        this.selectProductArray.push(row);
        //重新計算總價
        this.totalPrice = 0;
        this.selectProductArray.forEach(selectData => {
          this.totalPrice += selectData.amount * selectData.product.price;
        });
      }
    },
    goCheckout() {
      this.setLoading(true);
      sessionStorage.setItem('buyArray', JSON.stringify(this.selectProductArray));
      router.push({ path: '/product/buy_page' });
    },
    updateShoppingCar(action){

    }
  },
};
</script>
<style lang="scss" scoped>
.all {
  padding: 10px;
  box-sizing: border-box;
}
.proudct-warn {
  color: red;
  font-size: 15px
}
.proudct-text {
  font-size: 15px
}
.top-group {
  display: flex;
  justify-content: space-between;

  .top-button {
    display: flex;
    align-items: center;
  }

  .top-total-descrip {
    margin-right: 3%;
  }
}
.form{
  //height: 80%;
  .table{
    height: 100%;
  }
}

.picture-div {

  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 0px 40px 0px;

  .image {
    max-height: 100%;
    max-width: 100%;
    display: block;
    width: auto;
    height: auto;
  }
}
.input-form {
  display: flex;
  align-items: center;

  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }

  .input {
    margin-left: 0px;
    width: 170px;
  }

}
.detail-text {
  font-size: 1px
}
.detail-title {
  font-size: 30px
}
.shopping-car-pagination {
  float: right;
  margin: 10px 15px 0px 0px;
}

.description-div {
  width: 300px;
  ::v-deep .description-label {
    width: 100px;
  }
}


</style>
