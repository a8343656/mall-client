import Vue from 'vue';
import Router from 'vue-router';


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
    const path = item.path
    const component = view(path);

    return {
      name, path, component, meta
    };
  });
  // 因為 homepage 不需要登入，所以另外做設定
  childRoute.push({
    path: '/productDetail/:productId',
    meta: {
      guest: true,
    },
    component: view('forestage/detail'),
  });
  childRoute.push({
    path: '/buyPage',
    meta: {
      auth: true,
    },
    component: view('forestage/buy_page'),
  });

  return childRoute;
};

export default new Router({
  mode: 'history',
  routes: [
    // 自定義的路由
    {
      path: '/',
      name: 'homepageLayout',
      //redirect: '/forestage/home',
      //children: getRoute(Route),
      component: view('layout/homepage＿layout'),
    },
    {
      path: '/login/:goto?',
      name: 'login',
      meta: { guest: true },
      component: view('login/login'),
    },
    // {
    //   path: '/register',
    //   name: 'register',
    //   meta: { guest: true },
    //   component: view('forestage/register'),
    // },
    // {
    //   path: '/member',
    //   meta: { auth: true },
    //   redirect: '/member/member_data/member_data',
    //   children: getRoute(MemberRoute),
    //   component: view('home/member_layout'),
    // },
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
