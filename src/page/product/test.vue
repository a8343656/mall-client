<template lang="pug">
  div
    h5 test
</template>
<script>


export default {
  data() {
    return{}
  },
  created() {
    console.log(this.$route.params.page)
  },

};
</script>
<style lang="scss" scoped>

.home-page-list ul li {
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
      // width: 120px;
      height: 50px;
      margin: 5px;
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
.input-form {
  margin: 20px 0px 0px 0px;
  .input {
    width: 170px;
  }
}

.detail-text {
  font-size: 1px
}
.detail-title {
  font-size: 30px
}

.buy-price {
  display: flex;
}
.description-div {
  width: 300px;
  ::v-deep .description-label {
    width: 100px;
  }
}
.buy-description-div {
  width: 150px
}


</style>
