<template lang="pug">
  div(class="all")
    div(class="top-group")
      div(class="top-button")
        el-button(:disabled="selectProductArray.length == 0" type="primary" @click="goCheckout()") 去結帳
        el-button(:disabled="selectProductArray.length == 0" @click="removeFromShoppingCar()" :loading="deleteBtnLoading") 刪除
      div(class="top-total-descrip")
        H4 總共{{selectProductArray.length}}個商品
        H1 總金額{{totalPrice}}

    el-form(:model="model", ref="shoppingCarRef" :rules="model.inputRules" validate-on-rule-change=true)
      el-table(:data="model.shoppingCarArray" :cell-style="{padding: '0', height: '100px'}")
        el-table-column(label="勾選" width="150")
          template(slot-scope="scope")
            el-form-item(:prop="'shoppingCarArray.'+scope.$index+'.isSelected'" :rules="model.inputRules.isSelected")
              el-checkbox(v-model="scope.row.isSelected" @change="rowChange(scope.row)" )

        el-table-column(label="商品狀態")
          template(slot-scope="scope")
            p(class="proudct-text" v-if="scope.row.product.amount != 0 && scope.row.product.isBuyable == 1") 正常
            p(class="proudct-warn" v-if="scope.row.product.amount == 0 && scope.row.product.isBuyable != 0") 庫存不足
            p(class="proudct-warn" v-if="scope.row.product.isBuyable == 0") 商品下架中

        el-table-column(label="商品名稱" prop="product.name")

        el-table-column(label="庫存數量" prop="product.amount")

        el-table-column(label="單價" prop="product.price")

        el-table-column(label="購買金額" prop="buyPrice")

        el-table-column(label="購買數量" )
          template(slot-scope="scope")
            div(class="input-form")
              el-form-item(:prop="'shoppingCarArray.'+scope.$index+'.buyAmount'" :rules="model.inputRules.buyAmount")
                el-input(class="input" type="number" placeholder="請輸入購買數量" v-model.number="scope.row.buyAmount" @change="rowChange(scope.row)")


    div(class="shopping-car-pagination")
      el-pagination(
        layout="prev, pager, next"
        background
        :hide-on-single-page="true"
        :current-page.sync="page.currentPage"
        :page-size="page.pageSize"
        :total.sync="page.total"
        @current-change="changePage()")
</template>

<script>
import router from '@/router'
import ElementUI from 'element-ui';
import userApi from '@/api/user';

export default {
  data() {
    const buyValidator = (rule, value, callback) => {
      const index = rule.field.split('.')[1];
      const onePageData = this.model.shoppingCarArray[index];

      // 用是否有勾選來判斷，是否需要進行驗證
      if (onePageData.isSelected) {
        if (value === '' || value <= 0) {
          callback(new Error('請輸入購買數量'));
        } else if (onePageData.product.amount < value) {
          callback(new Error('購買數量大於庫存'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const selectedValidator = (rule, value, callback) => {
      const index = rule.field.split('.')[1];
      const onePageData = this.model.shoppingCarArray[index];

      // 如果有被勾選，該商品又無法購買，進行警示
      if (value) {
        if (onePageData.product.isBuyable == "0" || onePageData.product.amount === 0) {
          callback(new Error('該商品無法購買'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      buyWindowVisible: false,
      model: {
        shoppingCarArray: [],
        inputRules: {
          buyAmount: [{
            required: true, validator: buyValidator, type: 'number',
          }],
          isSelected: [{
            required: true, validator: selectedValidator, type: 'bool', trigger: 'change',
          }],
        },
      },
      totalPrice: 0,
      selectProductArray: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 5,
        previewPage: undefined,
      },
      deleteBtnLoading: false,
    };
  },
  created() {
    this.getUserShoppingCar();
    this.page.previewPage = 1;
  },
  methods: {
    setLoading(status) {
      this.$store.dispatch('setLoading', status);
    },
    getUserShoppingCar() {
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
          this.page.total = apiRes.data.totalElements;

          // 後端資料傳過來後，預設「是否被選中」、「購買數量」這兩個值
          onePageData.forEach(apiData => {
            apiData.isSelected = false;
            apiData.buyAmount = 1;
            apiData.buyPrice = apiData.product.price;

            // 判斷是否已在前端被選中，將塞入購買數量與勾選塞入
            this.selectProductArray.forEach(selectData => {
              if (selectData.id === apiData.id) {
                apiData.buyPrice = selectData.buyPrice;
                apiData.buyAmount = selectData.buyAmount;
                apiData.isSelected = true;
              }
            });
          });

          this.model.shoppingCarArray = onePageData;
          // 若使用者是按立刻購買過來的，因為後端排序的關係會在第一筆，所以把第一筆資料勾選，並塞入被選擇的 array 中
          if (sessionStorage.getItem('buyNow')) {
            const buyItem = this.model.shoppingCarArray[0];
            buyItem.isSelected = true;
            this.rowChange(buyItem);
            sessionStorage.removeItem('buyNow');
          }
        }
        setTimeout(() => {
          this.setLoading(false);
        }, 500);
      });
    },
    changePage() {
      // 正確填寫資訊才能切頁
      this.$refs.shoppingCarRef.validate(valid => {
        if (valid) {
          this.page.previewPage = this.page.currentPage;
          this.getUserShoppingCar();
        } else {
          this.page.currentPage = this.page.previewPage;
          ElementUI.Notification.error({
            message: '輸入資料有誤',
          });
        }
      });
    },
    removeFromShoppingCar() {
      const deletIdList = []
      this.selectProductArray.forEach(item => {
        deletIdList.push(item.id);
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
      // 計算購買金額
      row.buyPrice = row.product.price * row.buyAmount; // eslint-disable-line no-param-reassign

      // 先從已選擇的清單中移除
      this.selectProductArray = this.selectProductArray.filter(product => product.id !== row.id);
      // 如果該筆資料是有被選中的，判斷只是購買數量變更，利用移除後再新增當作更新
      if (row.isSelected) {
        this.selectProductArray.push(row);
      }
      this.totalPrice = 0;
      this.selectProductArray.forEach(selectData => {
        this.totalPrice += selectData.buyAmount * selectData.product.price;
      });
    },
    goCheckout() {
      this.setLoading(true);
      sessionStorage.setItem('buyArray', JSON.stringify(this.selectProductArray));
      router.push({ path: '/product/buy_page' });
    },
  },
};
</script>
<style lang="scss" scoped>
.all {
  margin: 1%;
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
