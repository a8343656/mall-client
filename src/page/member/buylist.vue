<template lang="pug">
  div
    el-table(:data="buylistArray" @sort-change="changeSort")
      el-table-column(label="訂單編號" prop="id")
      el-table-column(label="商品名稱" prop="name" sortable="custom")
      el-table-column(label="訂購數量" prop="buyAmount" sortable="custom")
      el-table-column(label="訂單狀態" prop="status" sortable="custom")
        template(slot-scope="scope")
          span(v-if="scope.row.status == 0") 訂單處理中
          span(v-if="scope.row.status == 1") 貨品準備中
          span(v-if="scope.row.status == 2") 寄送中
          span(v-if="scope.row.status == 3") 已完成
      el-table-column(label="管理")
        template(slot-scope="scope")
          span
            el-button(type="danger"
                      class="manage-button"
                      @click="cancelBuyList(scope.row)"
                      :disabled="scope.row.status>=2"
                      :loading="cancelBtnLoading") 取消訂單

    div(class="buy-list-pagination")
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
import ElementUI from 'element-ui';
import userApi from '@/api/user';

export default {
  data() {
    return {
      buylistArray: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 5,
      },
      sortData: {
        column: 'name',
        order: 'ascend',
      },
      cancelBtnLoading: false,
    };
  },
  created() {
    this.getUserBuyLIst();
  },
  methods: {
    setLoading(status) {
      this.$store.dispatch('app/setMainLoading', status);
    },
    changeSort(data) {
      this.sortData.column = data.prop;
      this.sortData.order = data.order;

      if (!data.order) {
        this.sortData.order = 'ascending';
      }
      this.getUserBuyLIst();
    },
    getUserBuyLIst() {
      this.setLoading(true);
      const sendData = {
        buylist: {
          userId: sessionStorage.getItem('userId'),
        },
        page: this.page,
        sortData: this.sortData,
      };
      userApi.getUserBuyList(sendData).then((res) => {
        const apiRes = res.data;

        if (apiRes.success) {
          const pageData = apiRes.data;

          this.page.total = pageData.total;
          this.buylistArray = pageData.data;
        }
        setTimeout(() => {
          this.setLoading(false);
        }, 500);
      });
    },
    cancelBuyList(record) {
      const sendData = {
        id: record.id,
      };

      this.cancelBtnLoading = true;
      userApi.cancelBuyList(sendData).then((res) => {
        const apiRes = res.data;
        this.cancelBtnLoading = false;

        if (apiRes.success) {
          ElementUI.Notification.success({
            message: '取消成功',
          });
        }
        // 刷新頁面資料
        this.getUserBuyLIst();
      });
    },
    changePage() {
      this.getUserBuyLIst();
    },
  },
};
</script>
<style lang="scss" scoped>

.buy-list-pagination {
  float: right;
  margin: 10px 15px 0px 0px;
}

</style>
