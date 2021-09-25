<template>
  <el-container class="el-container">
    <el-header>
      <div class="header-div">
        <img src="../../assets/logo.png" alt="logo" />
        <span><router-link to="/">后台管理系统</router-link></span>
        <el-button style="float: right" type="info" @click="logoout"
          >退出</el-button
        >
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <div class="toggle-button" @click="openCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menusData" :index="item.id" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template #title>
              <i class="el-icon-location"></i>
              <span>{{ item.title }}</span>
            </template>

            <el-menu-item
              v-for="subItem in item.children"
              :index="'/' + subItem.path"
              :key="subItem.id"
              @click="saveNavPath('/' + subItem.path)"
              >{{ subItem.title }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import axios from "axios";
import router from "../../router";
function useLoadMenuData(state) {
  axios.get("/menus").then((res) => {
    state.menusData = res.data;
  });
}
export default {
  setup() {
    const state = reactive({
      menusData: [],
      isCollapse: false,
      activePath: "",
    });
    onMounted(() => {
      useLoadMenuData(state);
      state.activePath = window.sessionStorage.getItem("activePath");
    });
    function openCollapse() {
      state.isCollapse = !state.isCollapse;
    }
    // 保存链接的激活状态
    function saveNavPath(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      state.activePath = activePath;
    }
    //用户退出登录
    function logoout() {
      window.sessionStorage.clear();
      router.push("/login");
    }
    return {
      ...toRefs(state),
      openCollapse,
      logoout,
      saveNavPath,
    };
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
.el-container {
  height: 1000px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-header {
  background-color: #373d41;
  color: #fff;
  font-size: 20px;
}
a {
  text-decoration: none;
  color: #fff;
}
.header-div img {
  vertical-align: middle;
  width: 60px;
  height: 60px;
  margin-right: 20px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
