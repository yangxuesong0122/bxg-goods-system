<template>
  <el-dialog
    title="添加用户信息"
    width="30%"
    center
    v-model="centerDialogVisible"
    @close="closeDialog(false)"
  >
    <!--用户表单-->
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="70px"
      status-icon
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="addForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPwd">
        <el-input v-model="addForm.userPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="userMail">
        <el-input v-model="addForm.userMail"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          ype="primary"
          @click="
            () => {
              closeDialog(false);
            }
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs, ref } from "vue";
import axios from "axios";
function userCheckMail() {
  const checkMail = (rule, value, cb) => {
    const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if (regEmail.test(value)) {
      return cb();
    }
    cb(new Error("请输入合法的邮箱"));
  };
  return {
    checkMail,
  };
}
// 完成用户信息的添加
function useAdd(addFormRef, emit) {
  const submitAdd = () => {
    addFormRef.value.validate((vaild) => {
      if (vaild) {
        axios.post("/users/add", addFormRef.value.model).then((res) => {
          emit("onCloseDialog", false, res.data);
          addFormRef.value.resetFields();
        });
      }
    });
  };
  return {
    submitAdd,
  };
}
export default {
  props: {
    centerDialogVisible: Boolean,
  },
  emits: ["onCloseDialog"],
  setup(props, { emit }) {
    const addFormRef = ref();
    const state = reactive({
      centerDialogVisible: props.centerDialogVisible,
      addForm: {
        userName: "",
        userPwd: "",
        userMail: "",
      },
    });
    //定义验证规则。
    const addFormRules = {
      userName: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        {
          min: 3,
          max: 10,
          message: "用户名的长度在3~10个字符之间",
          trigger: "blur",
        },
      ],
      userPwd: [
        { required: true, message: "请输入密码", trigger: "blur" },
        {
          min: 6,
          max: 15,
          message: "用户名的长度在6~15个字符之间",
          trigger: "blur",
        },
      ],
      userMail: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { validator: userCheckMail().checkMail, trigger: "blur" },
      ],
    };
    const closeDialog = (visible) => {
      addFormRef.value.resetFields();
      emit("onCloseDialog", visible);
    };
    return {
      ...toRefs(state),
      addFormRules,
      closeDialog,
      addFormRef,
      ...useAdd(addFormRef, emit),
    };
  },
};
</script>

<style></style>
