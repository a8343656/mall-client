<template lang="pug">
  div(class="all")
    div
      p(class="detail-title") {{product.name}}
      div(class="picture-div")
        img(class="image" :src="product.imageUrl")
      div(class="description-div")
        el-descriptions(:column="1" label-class-name="description-label" border)
          el-descriptions-item(label="價格") {{product.price}}
          el-descriptions-item(label="剩餘數量") {{product.amount}}
          //el-descriptions-item(label="產品介紹" contentClassName="introduce") {{product.introduce}}
      div(class="button-group")
        el-button(type="primary" :disabled="product.amount == 0" @click="clickBuy()") 立刻購買
        el-button(:disabled="product.amount == 0" @click="clickAddShoppingCar()") 加入購物車

</template>

<script>
import ElementUI from 'element-ui';
import productApi from '@/api/product';
import router from '@/router'

export default {
  data() {
    return {
      product: {
        id: '',
        name: '',
        amount: '',
        imageUrl: '',
        price: 0,
      }
    };
  },
  created() {
    this.getProduct();
  },
  methods: {
    setLoading(status) {
      this.$store.dispatch('setLoading', status);
    },
    getProduct() {
      const id = this.$route.query.productId;

      this.setLoading(true);
      productApi.getProductDetail(id).then((res) => {
        const apiRes = res.data;

        if (apiRes.success) {
          this.product = apiRes.data;
        }
        setTimeout(() => {
          this.setLoading(false);
        }, 500);
      });
    },
    clickBuy() {
      this.addShoppingCar(this.product, true);
    },
    clickAddShoppingCar() {
      this.addShoppingCar(this.product, false);
    },
    addShoppingCar(product, isClickBuyButton) {
      // 若是沒有登入，導到登入頁
      if (!sessionStorage.getItem('userId')) {
        ElementUI.Notification.warning({
          message: '尚未登入請先登入',
        });

        router.push('/login');
      } else {
        const sendData = {
          userId: sessionStorage.getItem('userId'),
          productId: product.id,
        };
        this.setLoading(true);
        forestageApi.addToShoppingCar(sendData).then((res) => {
          const apiRes = res.data;
          if (apiRes.result) {
            // 若是點擊購買按鈕，跳轉至購物車頁面，並且在 session 中加入變數，讓購物車頁面可以判斷是否勾選第一項商品
            if (isClickBuyButton) {
              sessionStorage.setItem('buyNow', true);
              router.push({ path: '/product/shopping_car' });
            } else {
              // 單純點及加入購物車
              ElementUI.Notification.success({
                message: '成功加入購物車',
              });
            }
            this.setLoading(false);
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.all {
  display: flex;
  justify-content: center;
  margin-top: 1.5%;
}

.picture-div {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
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
  margin: 20px 0px 0px 0px;

  .input {
    width: 170px;
  }
}

.detail-title {
  font-size: 30px
}

.description-div {
  width: 400px;

  ::v-deep.description-label {
    width: 100px;
  }
  ::v-deep.introduce {
    height: 150px;
  }
}

.button-group {
  margin-top: 20px;
  float: right;
}
</style>
