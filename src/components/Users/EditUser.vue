<template>
  <el-dialog
    title="编辑用户信息"
    width="30%"
    center
    v-model="editDialogVisible"
    @close="closeEditDialog(false)"
  >
    <!--用户表单-->
    <el-form
      :model="editForm"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="70px"
      status-icon
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="editForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPwd">
        <el-input v-model="editForm.userPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="userMail">
        <el-input v-model="editForm.userMail"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="
            () => {
              closeEditDialog(false);
            }
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from "vue";
import axios from "axios";
//自定义校验规则
function useCheckMail() {
  const checkMail = (rule, value, cb) => {
    console.log("rule=", rule);
    // 验证邮箱的正则表达式
    const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if (regEmail.test(value)) {
      //合法的邮箱
      return cb();
    }
    cb(new Error("请输入合法的邮箱规则"));
  };
  return {
    checkMail,
  };
}
function useLoadEditData(state) {
  axios
    .get("/users/get", { params: { userId: state.editForm.userId } })
    .then((res) => {
      state.editForm = res.data;
    });
}
function useEdit(state, validateForm, emit) {
  const submitEdit = () => {
    validateForm.value.validate((vaild) => {
      if (vaild) {
        axios.post("/users/edit", state.editForm).then((res) => {
          emit("onCloseEditDialog", false, res.data);
        });
      }
    });
  };
  return {
    submitEdit,
  };
}
export default {
  props: {
    editDialogVisible: Boolean,
    userId: Number,
  },
  emits: ["onCloseEditDialog"],
  setup(props, { emit }) {
    const editFormRef = ref();
    const state = reactive({
      editDialogVisible: props.editDialogVisible,
      editForm: {
        userId: props.userId,
        userName: "",
        userPwd: "",
        userMail: "",
      },
    });
    const editFormRules = {
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
        { validator: useCheckMail().checkMail, trigger: "blur" },
      ],
    };
    onMounted(() => {
      useLoadEditData(state);
    });
    const closeEditDialog = (visible) => {
      emit("onCloseEditDialog", visible);
    };
    return {
      ...toRefs(state),
      editFormRules,
      closeEditDialog,
      editFormRef,
      ...useEdit(state, editFormRef, emit),
    };
  },
};
</script>

<style></style>
