import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from './router'
import store  from './store'
import Element from 'element-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(Element)
Vue.use(Vuex)
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  // 切換路由的loading
  store.dispatch('setLoading', true);
 
   // 是否要檢查登入狀態
  if (to.meta.auth) {
    // 因為 axios 有設定 token 過期會導回根目錄，如果去的路徑是需要登入的，試著拿取使用者自身的資料，藉此檢查 token
    const userId = sessionStorage.getItem('userId');

    // 這邊只做判斷是否有 token ，是否過期交給 axios 攔截器
    if (userId) {
      next();
    } else {
      ElementUI.Notification.warning({
        message: '尚未登入請先登入',
      });
      next('/login');
    }

    // 訪客可以訪問的頁面
  } else {
    next();
  }
});

router.afterEach(() =>{
  store.dispatch('setLoading', false);
})