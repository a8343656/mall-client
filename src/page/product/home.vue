<template lang="pug">
  div
    div(class="home-page-list")
      ul
        li(v-for="product in productArray" :key="product.id")
          el-card
            p(class="title") {{product.name}}
              div(class="picture-div")
                img(class="image"  :src="product.imageUrl")

            div(class="product-detial-group")
              // 讓兩個警示訊息與商品資訊呈現在卡片的左右兩側
              div(class="buy-description-div")
                el-descriptions(:column="1")
                  el-descriptions-item(label="價格") {{product.price}}
                  el-descriptions-item(label="剩餘數量") {{product.amount}}
              div
                p(class="proudct-warn" v-if="product.amount == 0") 庫存不足
            div(class="btn-group")
              el-button(class="home-page-button" @click="clickBuy(product)" :disabled="product.amount == 0") 立刻購買
              el-button(class="home-page-button"
                        @click="clickAddShoppingCar(product)"
                        :disabled="product.amount == 0"
                        :loading="addShoppingCarBtnLoading") 加入購物車
              el-button(class="home-page-button" @click="gotoDetail(product)" ) 詳細資料

    // 下方分頁
    div(class="home-pagination")
      el-pagination(
        layout="prev, pager, next",
        background
        hide-on-single-page=true
        :current-page.sync="page.currentPage",
        :page-size="page.pageSize",
        :total.sync="page.total",
        @current-change="changePage()")
</template>
<script>
import ElementUI from 'element-ui';
import router from '@/router'
import userApi from '@/api/user';
import productApi from '@/api/product';

export default {
  data() {
    return {
      detailWindowVisible: false,
      buyWindowVisible: false,
      productArray: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 8,
      },
      addShoppingCarBtnLoading: false,
    };
  },watch:{
    // watch 用來判斷是否按 [回到首頁] 造成 url 的改變
    '$route.query.page'(value) {
      this.page.currentPage = Number(value)
      this.getProduct();
    }
  },
  created() {
    // 如果是一開始進來， router 那邊
    if(this.$route.query.page!= undefined){
       this.page.currentPage = Number(this.$route.query.page);
    }
    this.getProduct();
  },
  methods: {
    // 顯示加載畫面
    setLoading(status) {
      this.$store.dispatch('setLoading', status);
    },
    changePage() {
      //大多情況是 url 參數改變 data.page，只有 changePage 時是由 data.page 改變 url
      router.push({ path: '/product/home', query: { page: this.page.currentPage } })
      this.getProduct();
    },
    getProduct() {
      const sendData = {
        page: this.page.currentPage
      }

      this.setLoading(true);
      productApi.getProductList(sendData).then((res) => {
        const result = res.data;

        if (result.success) {
          // 如果頁數大於後端的最末頁數，強制轉跳至最末頁
          if(this.page.currentPage > result.data.totalPages){
            router.push({ path: '/product/home', query: { page: result.data.totalPages } })
          }
          this.page.total = result.data.totalElements;
          this.productArray = result.data.content;
        }
        setTimeout(() => {
          this.setLoading(false);
        }, 500);
      });
    },
    clickBuy(product) {
      // 因為頁面會重新導向，先開啟 loading 避免重覆點擊，routerAfter 有設定關閉
      this.setLoading(true);
      this.addShoppingCar(product, true);
    },
    clickAddShoppingCar(product) {
      this.addShoppingCarBtnLoading = true;
      this.addShoppingCar(product, false);
    },
    addShoppingCar(product, isClickBuyButton) {
      // 若是沒有登入，導到登入頁
      if (!localStorage.getItem('userId')) {
        ElementUI.Notification.warning({
          message: '尚未登入請先登入',
        });
        router.push('/login');
      } else {
        //判斷使用者購物車中是否有該商品
        const sendData = {
          userId: Number(localStorage.getItem('userId')),
          updateList:[],
        };
        var addItem = new Object();
        addItem.productId = product.id;
        addItem.saveAmount = 1;

        sendData.updateList.push(addItem);

        userApi.addShoppingCar(sendData).then((res) => {
          const apiRes = res.data;
          if (apiRes.success) {
            // 若是點擊購買按鈕，跳轉至購物車頁面，並且在 session 中加入變數，讓購物車頁面可以判斷是否勾選第一項商品
            if (isClickBuyButton) {
              localStorage.setItem('buyNow', true);
              router.push({ path: '/product/shopping_car' });
            } else {
              // 單純點及加入購物車
              this.addShoppingCarBtnLoading = false;
              ElementUI.Notification.success({
                message: '成功加入購物車',
              });
            }
          }
        });
      }
    },
    gotoDetail(product) {
      router.push({ path: '/product/detail/',  query: { productId: product.id } });
    },
  },
};
</script>
<style lang="scss" scoped>

.home-page-list  {
  ul li{
    width: 25%;
    display: inline-block;

    .title {
      font-size: 20px
    }
    .product-detial-group {
      display: flex;
      justify-content: space-between;

      .proudct-warn {
        color: red;
        font-size: 20px;
      }
      .amount-text {
        font-size: 15px;
      }
    }
    .btn-group {
      .home-page-button {
        height: 50px;
        margin: 5px;
      }
    }
  }
}

.picture-div {
  width: 200px;
  height: 200px;
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
.home-pagination {
  float: right;
  margin: 2px 15px 0px 0px;
}

.buy-description-div {
  width: 150px
}


</style>
