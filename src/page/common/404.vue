<template lang="pug">
  div(class="all")
    el-result(class="result" icon="error" title="404" subTitle="伺服器暫無回應，請稍後再試")
      template(slot="extra")
        el-button(@click="retry") 重試
</template>

<script>
export default {
  methods: {
    retry() {
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
  .all{
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center; 
  }
  
</style>
