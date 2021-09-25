<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <img src="../assets/logo.png" style="width: 50px; height: 50px" />
        <span>商品列表</span>
      </div>
    </template>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input
          placeholder="请输入搜索商品名称"
          v-model="searchContent"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="addGoodsInfo()">添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="编号" width="180">
        <template #default="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="180">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top">
            <template #default>
              <p>商品名称: {{ scope.row.title }}</p>
              <p>单价: {{ scope.row.price }}</p>
            </template>
            <template #reference>
              <div class="name-wrapper">
                <el-tag size="medium">{{ scope.row.title }}</el-tag>
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" width="180">
        <template #default="scope">
          <span style="margin-left: 10px">
            <img
              :src="url + scope.row.thumbnail"
              style="width: 180px; height: 180px"
            />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    >
    </el-pagination>
  </el-card>
  <AddProduct
    :centerDialogVisible="centerDialogVisible"
    @onCloseDialog="closeDialogVisible"
  ></AddProduct>
  <EditProduct
    v-if="editDialogVisible === true"
    :editDialogVisible="editDialogVisible"
    :goodsId="pId"
    @onCloseEidtDialog="closeEditDialogVisible"
  ></EditProduct>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import axios from "axios"; // npm install axios
import AddProduct from "./AddProduct.vue";
import EditProduct from "./EditProduct.vue";
import { ElMessageBox, ElNotification } from "element-plus";
function loadData(state) {
  const params = {
    pageNumber: state.currentPage,
    pageSize: state.pageSize,
    search: state.searchContent,
  };
  axios.get("/goods", { params }).then((res) => {
    state.tableData = res.data.list;
    state.total = res.data.totalCount; //总的记录数
  });
}
//编辑商品信息
function useEdit(state) {
  const handleEdit = (index, row) => {
    state.editDialogVisible = true;
    state.pId = row.id;
  };
  return {
    handleEdit,
  };
}
// 搜索商品数据
function useHandleSearch(state) {
  const handleSearch = () => {
    state.currentPage = 1;
    const params = {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      search: state.searchContent,
    };
    axios.get("/goods", { params }).then((res) => {
      state.tableData = res.data.list;
      state.total = res.data.totalCount;
    });
  };
  return {
    handleSearch,
  };
}
//删除商品数据
function useDelete(state) {
  const handleDelete = (index, row) => {
    // console.log("index=", index);
    // console.log("row=", row);
    ElMessageBox.confirm("你确定要删除该记录吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      callback: (action) => {
        if (action === "confirm") {
          axios
            .delete("/goods/delete", { params: { id: row.id } })
            .then((res) => {
              if (res.data.code === "ok") {
                ElNotification({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
                  duration: 2000,
                });
                loadData(state);
              } else {
                ElNotification({
                  title: "失败",
                  message: "删除失败",
                  type: "error",
                  duration: 2000,
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
    AddProduct,
    EditProduct,
  },
  setup() {
    const state = reactive({
      tableData: [],
      centerDialogVisible: false,
      editDialogVisible: false, //控制编辑商品窗口的显示与隐藏
      total: 0,
      currentPage: 1,
      pageSize: 3,
      searchContent: "", //搜索条件
      pId: 0, //要编辑的商品的编号
    });
    const url = import.meta.env.VITE_APP_URL;
    onMounted(() => {
      loadData(state);
    });
    const addGoodsInfo = () => {
      state.centerDialogVisible = true;
    };
    const closeDialogVisible = (visible, data) => {
      state.centerDialogVisible = visible;
      if (data !== undefined) {
        // state.tableData.push(data);
        loadData(state);
      }
    };
    const closeEditDialogVisible = (visible, data) => {
      state.editDialogVisible = visible;
      if (data !== undefined) {
        loadData(state);
      }
    };
    //页面(页码)切换的时候执行该方法
    const changePage = (val) => {
      state.currentPage = val;
      loadData(state);
    };
    return {
      ...toRefs(state),
      url,
      addGoodsInfo,
      closeDialogVisible,
      ...useDelete(state),
      changePage,
      ...useHandleSearch(state),
      ...useEdit(state),
      closeEditDialogVisible,
    };
  },
};
</script>

<style></style>
