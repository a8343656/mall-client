import Vue from 'vue';
import Router from 'vue-router';
import ProductRoute from './product_route.json'
import MemberRoute from './member_route.json'


Vue.use(Router);

const view = page => () => import(`@/page/${page}.vue`);

const getRoute = (route) => {
  // 組合路由表資料
  const childRoute = route.map((item) => {
    const meta = {
      auth: item.auth,
    };

    //補上如果是 member 介面，強制設定為 auth = true
    const name = item.name;
    const component = view(item.path);
    let path = item.path;

    // 若路由有url參數，改變路徑
    if(item.qstr){
      path = item.path + item.qstr
    }

    return {
      name, path, component, meta
    };
  });

  // childRoute.push({
  //   path: '/aaa',
  //   meta: {
  //     auth: true,
  //   },
  //   component: view('member/member_data'),
  // });


  return childRoute;
};

export default new Router({
  mode: 'history',
  routes: [
    // 自定義的路由
    {
      path: '/',
      name: 'homepageLayout',
      redirect: '/product/home',
      children: getRoute(ProductRoute),
      component: view('layout/homepage＿layout'),
    },
    {
      path: '/login',
      name: 'login',
      component: view('auth/login'),
    },
    {
      path: '/register',
      name: 'register',
      component: view('auth/register'),
    },
    {
      path: '/member',
      name: 'memberpageLayout',
      meta: { auth: true },
      redirect: '/member/member_data/member_data',
      children: getRoute(MemberRoute),
      component: view('layout/member_layout'),
    },
    // {
    //   path: '*',
    //   meta: {
    //     title: 'unable_show_page',
    //     auth: true,
    //     checkPermissions: false,
    //   },
    //   props: { message: 'unable_show_page' },
    //   component: view('error_page'),
    // },
  ],
});
