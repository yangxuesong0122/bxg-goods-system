<template>
  <el-dialog
    title="添加商品信息"
    v-model="centerDialogVisible"
    width="30%"
    center
    @close="closeDialog(false)"
  >
    <el-form
      :model="goodsForm"
      :rules="rules"
      ref="validateForm"
      label-width="100px"
    >
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="goodsForm.title"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model="goodsForm.price"></el-input>
      </el-form-item>

      <el-form-item label="商品图片" prop="coverImg">
        <el-upload
          class="avatar-uploader"
          :action="uploadURL"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="handleBeforeUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品详情" prop="goodsDetail">
        <QuillEditor theme="snow" ref="editor"></QuillEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sumbitAdd">添加商品</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            () => {
              closeDialog(false);
            }
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="sumbitAdd">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs, ref } from "vue";
//npm install @vueup/vue-quill@beta --save
//QuillEditor
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import axios from "axios";
import { ElMessage } from "element-plus";
//添加商品的方法
function useAdd(state, validateForm, editor, emit) {
  const sumbitAdd = () => {
    state.goodsForm.goodsDetail =
      editor.value.getText().replace(/(\r\n|\n|\r)/gm, "<br />") !== "<br />"
        ? editor.value.getHTML()
        : "";
    validateForm.value.validate((valid) => {
      if (valid) {
        const params = {
          title: state.goodsForm.title,
          price: state.goodsForm.price,
          thumbnail: state.goodsForm.coverImg,
          goodsDetail: state.goodsForm.goodsDetail,
        };
        axios.post("/goods/add", params).then((res) => {
          validateForm.value.resetFields(); //重置表单
          editor.value.setText("");
          emit("onCloseDialog", false, res.data);
        });
      }
    });
  };
  return {
    sumbitAdd,
  };
}
// 完成文件上传类型校验
const handleBeforeUpload = (file) => {
  const arr = file.name.split(".")[1];
  if (!["jpg", "jpeg", "png"].includes(arr)) {
    ElMessage.error("请上传jpg,jpeg,png类型的图片文件");
    return false;
  }
};
export default {
  components: {
    QuillEditor,
  },
  props: {
    centerDialogVisible: Boolean,
  },

  emits: ["onCloseDialog"],
  setup(props, { emit }) {
    const validateForm = ref();
    const editor = ref();
    const state = reactive({
      centerDialogVisible: props.centerDialogVisible,
      uploadURL: import.meta.env.VITE_APP_URL + "/goods/fileUpload",
      imageUrl: "",
      goodsForm: {
        title: "",
        price: 0,
        coverImg: "",
        goodsDetail: "",
      },
    });
    const closeDialog = (visible) => {
      state.imageUrl = "";
      emit("onCloseDialog", visible);
    };
    //上传成功以后，执行的处理函数
    const handleAvatarSuccess = (response) => {
      state.imageUrl = import.meta.env.VITE_APP_URL + response.msg;
      state.goodsForm.coverImg = response.msg;
    };
    const rules = {
      title: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
      price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
      coverImg: [
        { required: true, message: "请上传商品主图", trigger: "blur" },
      ],

      goodsDetail: [
        { required: true, message: "请输入商品详情", trigger: "blur" },
      ],
    };
    return {
      ...toRefs(state),
      closeDialog,
      rules,
      handleAvatarSuccess,
      ...useAdd(state, validateForm, editor, emit),
      validateForm,
      editor,
      handleBeforeUpload,
    };
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
}
</style>
