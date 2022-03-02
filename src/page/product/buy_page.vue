<template lang="pug">
  div(class="all")
    //此處兩層 div 是為了要讓內層水平置中
    div
      el-card(class="buy-table")
        el-table(:data="buyArray")
          el-table-column(label="商品名稱" prop="product.name")
          el-table-column(label="單價" prop="product.price")
          el-table-column(label="數量" prop="amount")
          el-table-column(label="購買金額" prop="buyPrice")
          
        div(class="total-descrip")
          H4 總共{{buyArray.length}}個商品
          H1 總金額{{totalPrice}}

      div(class="buy-data-div")
        el-form(:model="buyData" ref="buyDataRef" :rules="buyDataRules" label-position="left")

          el-form-item(label="取貨方式" prop="pickup")
            el-radio-group(v-model="buyData.pickup" @change="pickupChange")
              el-radio(:label="0") 超商取貨
              el-radio(:label="1") 宅配

          el-form-item(label="寄送地點" prop="sendAddress")
            // 超商取貨門市選擇
            el-select(v-if="buyData.pickup == 0" v-model="buyData.sendAddress")
              el-option(:key="item.key" :label="item.key" :value="item.value" v-for="item in selectOptions")
            // 宅配輸入地址
            el-input(v-if="buyData.pickup == 1" v-model="buyData.sendAddress")

          el-form-item(label="付款方式" prop="pay")
            el-radio-group(v-model="buyData.pay")
              el-radio(:label="0") 信用卡
              el-radio(:label="1") 貨到付款

          el-form-item(v-if="buyData.pay == 0" label="卡號" prop="cardNumber")
            el-input(v-model="buyData.cardNumber" type="phone" maxlength="19")

        div(class="button-group")
          el-button(type="primary" @click="sendOrder()" :loading="orderBtnLoading") 送出訂單
          el-button(@click="cancel()") 取消 

</template>

<script>
import ElementUI from 'element-ui';
import router from '@/router'
import transactionApi from '@/api/transaction';
import userApi from '@/api/user';

const selectOptions = [
  { key: '7-11 台北門市', value: '7-11 台北門市' },
  { key: '7-11 台中門市', value: '7-11 台中門市' },
  { key: '7-11 高雄門市', value: '7-11 高雄門市' },
];

export default {
  data() {
    return {
      buyArray: [{}],
      totalPrice: 0,
      buyData: {
        pickup: 0,
        sendAddress: '',
        pay: 0,
        cardNumber: '',
      },
      buyDataRules: {
        pickup: [{
          required: true, message: '請選擇取貨方式',
        }],
        sendAddress: [{
          required: true, message: '請填入寄送地點',
        }],
        pay: [{
          required: true, message: '請選擇付款方式',
        }],
        cardNumber: [{
          required: true, message: '請輸入卡號', trigger: 'blur',
        }, {
          min: 19, message: '卡號長度不正確', trigger: ['blur', 'change'],
        }],
      },
      selectOptions,
      orderBtnLoading: false,
    };
  },
  watch: {
    'buyData.cardNumber': function (newValue, oldValue) {
      const reg = /^([\d\s])+$/;
      // 判斷是否只有空格跟數字
      if (reg.test(newValue)) {
        if (newValue.length > oldValue.length) {
          // 先去除空格，再依照長度補上空格
          this.buyData.cardNumber = newValue.replace(/\s/g, '').replace(/(\d{4})(\d{0,4})(\d{0,4})(\d{0,4})/, '$1 $2 $3 $4');
        } else {
          // 若是長度減少，去除頭尾的空白
          this.buyData.cardNumber = this.buyData.cardNumber.trim();
        }
      } else if (newValue !== '') {
        // 不為空且正則不通過，代表含有非法字元，直接用舊的值覆蓋
        this.buyData.cardNumber = oldValue;
      }
    },
  },
  created() {
    // 若 session 中沒有購買清單，重新導回主頁
    if (sessionStorage.getItem('buyArray')) {
      this.buyArray = JSON.parse(sessionStorage.getItem('buyArray'));
      this.buyArray.forEach(product => {
        this.totalPrice += product.buyPrice;
      });
      this.setLoading(false);
    } else {
      router.push('/');
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem('buyArray');
  },
  methods: {
    setLoading(status) {
      this.$store.dispatch('setLoading', status);
    },
    pickupChange(value) {
      if (value === 0) {
        this.buyData.sendAddress = this.selectOptions[0].value;
      } else {
        this.buyData.sendAddress = '';
      }
    },
    sendOrder() {
      
      const sendData = {
        userId: Number(sessionStorage.getItem('userId')),
        totalPrice: this.totalPrice,
        detailList: []
      };
      this.buyArray.forEach(item =>{
        var detail = new Object();
        detail.productId = item.productId;
        detail.amount = item.amount;
        detail.productPrice = item.product.price;

        sendData.detailList.push(detail);
      })

      this.$refs.buyDataRef.validate(valid => {
        if (valid) {
          this.orderBtnLoading = true;
          transactionApi.buy(sendData).then((res) => {
            this.orderBtnLoading = false;
            const apiRes = res.data;
            if (apiRes.success) {
              ElementUI.Notification.success({
                message: '購買成功',
              });

              // 呼叫 api 把已購買的商品移出購物車，並轉跳回首頁
              const deleteIdList = []
              this.buyArray.forEach(item => {
                var deleteItem = new Object();
                deleteItem.productId = item.product.id
                deleteIdList.push(deleteItem);
              });

              const sendData2 = {
                userId: Number(sessionStorage.getItem('userId')),
                action:'delete',
                updateList: deleteIdList,
              };

              userApi.updateShoppingCar(sendData2).then(() => {
                router.push('/');
              });
            }
          });
        }
      });
    },
    cancel(){
      router.push('/')
    }
  },
};
</script>
<style lang="scss" scoped>
.all {
  display: flex;
  justify-content: center;
  margin-top: 1.5%;
}
.total-descrip {
  text-align: right;
}
.buy-table {
  width: 500px;
  height: auto;
}
.buy-data-div {
  width: 500px;
}
.button-group {
  float: right;
}
</style>
