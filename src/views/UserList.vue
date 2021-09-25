<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchContent">
            <template #prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" @click="handleSearch">搜索</el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="
              () => {
                addUserInfo();
              }
            "
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="tableData" border>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="邮箱" prop="userMail"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <AddUser
      :centerDialogVisible="centerDialogVisible"
      @onCloseDialog="closeDialogVisible"
    ></AddUser>
    <EditUser
      v-if="editDialogVisible === true"
      :editDialogVisible="editDialogVisible"
      :userId="uId"
      @onCloseEditDialog="closeEditDialogVisible"
    ></EditUser>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { ElMessageBox, ElNotification } from "element-plus";
import axios from "axios";
import AddUser from "../components/Users/AddUser.vue";
import EditUser from "../components/Users/EditUser.vue";
function useLoadData(state) {
  const params = {
    pageNumber: state.currentPage,
    pageSize: state.pageSize,
    search: state.searchContent,
  };
  axios.get("/users", { params }).then((res) => {
    state.tableData = res.data.list;
    state.total = res.data.totalCount;
  });
}

//监听pageSize改变的事件，获取每页显示的记录数，然后重新发送请求。
function useHandleSizeChnage(state) {
  const handleSizeChange = (newSize) => {
    // console.log("newSize=", newSize);
    state.pageSize = newSize;
    useLoadData(state);
  };
  return {
    handleSizeChange,
  };
}
// 监听页码值改变后，事件触发后执行的处理函数，在该函数中，获取当前的页码值，然后重新发送请求
function useHandleCurrentChange(state) {
  const handleCurrentChange = (newPage) => {
    // console.log("newPage=", newPage);
    state.currentPage = newPage;
    useLoadData(state);
  };
  return {
    handleCurrentChange,
  };
}
//实现用户搜索功能
function useSearch(state) {
  const handleSearch = () => {
    state.currentPage = 1;
    const params = {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      search: state.searchContent,
    };
    axios.get("/users", { params }).then((res) => {
      state.tableData = res.data.list;
      state.total = res.data.totalCount;
    });
  };
  return {
    handleSearch,
  };
}
//编辑用户信息
function useEdit(state) {
  const handleEdit = (row) => {
    state.editDialogVisible = true;
    state.uId = row.id;
  };
  return {
    handleEdit,
  };
}
//删除用户数据
function useDelete(state) {
  const handleDelete = (row) => {
    ElMessageBox.confirm("你确定要删除该记录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      callback: (action) => {
        if (action === "confirm") {
          axios
            .delete("/user/delete", { params: { id: row.id } })
            .then((res) => {
              if (res.data.code === "ok") {
                ElNotification({
                  title: "成功",
                  message: "删除成功",
                  duration: 2000,
                  type: "success",
                });
                useLoadData(state);
              } else {
                ElNotification({
                  title: "失败",
                  message: "删除失败",
                  duration: 2000,
                  type: "error",
                });
              }
            });
        }
      },
    });
  };
  return {
    handleDelete,
  };
}
export default {
  components: {
    AddUser,
    EditUser,
  },
  setup() {
    const state = reactive({
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 3,
      searchContent: "",
      centerDialogVisible: false,
      editDialogVisible: false, // 控制编辑窗口的显示与隐藏
      uId: 0,
    });
    onMounted(() => {
      useLoadData(state);
    });
    //关闭窗口
    const closeDialogVisible = (visible, data) => {
      state.centerDialogVisible = visible;
      if (data !== undefined) {
        useLoadData(state);
      }
    };
    //关闭编辑的窗口
    const closeEditDialogVisible = (visible, data) => {
      state.editDialogVisible = visible;
      if (data !== undefined) {
        useLoadData(state);
      }
    };
    const addUserInfo = () => {
      state.centerDialogVisible = true;
    };
    return {
      ...toRefs(state),
      ...useHandleSizeChnage(state),
      ...useHandleCurrentChange(state),
      ...useSearch(state),
      closeDialogVisible,
      addUserInfo,
      ...useEdit(state),
      closeEditDialogVisible,
      ...useDelete(state),
    };
  },
};
</script>

<style>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 14px;
}
</style>
