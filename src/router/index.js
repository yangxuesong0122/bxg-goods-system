import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "../components/Layout/index.vue";
const routes = [
  {
    path: "/",
    redirect: "/main",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/main",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("../views/Home.vue"),
      },
    ],
  },
  {
    path: "/goods",
    name: "商品管理",
    component: Layout,
    children: [
      {
        path: "goods-list",
        name: "GoodsList",
        component: () => import("../views/GoodsList.vue"),
      },
      {
        path: "goods-info",
        name: "商品详情",
        component: () => import("../views/GoodsInfo.vue"),
      },
    ],
  },
  {
    path: "/user",
    name: "用户管理",
    component: Layout,
    children: [
      {
        path: "user-list",
        name: "UserList",
        component: () => import("../views/UserList.vue"),
      },
      {
        path: "user-setting",
        name: "UserSetting",
        component: () => import("../views/UserSetting.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from: 表示从哪个路径跳转过来的
  // next:是一个函数，放行
  if (to.path === "/login") return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});
export default router;
