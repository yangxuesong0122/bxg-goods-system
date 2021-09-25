import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import locale from "element-plus/lib/locale/lang/zh-cn";
import App from "./App.vue";
import axios from "axios";
import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
axios.defaults.baseURL = import.meta.env.VITE_APP_URL;
axios.interceptors.request.use((config) => {
  //   console.log("config=", config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  NProgress.start();
  return config;
});
axios.interceptors.response.use((config) => {
  NProgress.done();
  return config;
});
const app = createApp(App);
app.use(ElementPlus, { locale });
app.use(router);
app.mount("#app");
