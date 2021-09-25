<template>
  <el-dialog
    title="编辑商品信息"
    v-model="editDialogVisible"
    width="30%"
    center
    @close="closeEditDialog(false)"
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
        <el-button type="primary" @click="sumbitEdit">编辑商品</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            () => {
              closeEditDialog(false);
            }
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="sumbitEdit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from "vue";
//npm install @vueup/vue-quill@beta --save
//QuillEditor
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import axios from "axios";
import { ElMessage } from "element-plus";
//根据商品编号，查询要编辑的数据
function useLoadEditData(state, editor) {
  axios
    .get("/goods/get", { params: { goodsId: state.goodsId } })
    .then((res) => {
      state.goodsForm = res.data;
      state.imageUrl = import.meta.env.VITE_APP_URL + res.data.thumbnail;
      state.goodsForm.coverImg = res.data.thumbnail;
      editor.value.setHTML(res.data.goodsDetail);
    });
}
function useEditData(state, validateForm, editor, emit) {
  const sumbitEdit = () => {
    state.goodsForm.goodsDetail =
      editor.value.getText().replace(/(\r\n|\n|\r)/gm, "<br />") !== "<br />"
        ? editor.value.getHTML()
        : "";
    validateForm.value.validate((vaild) => {
      if (vaild) {
        const params = {
          goodsId: state.goodsId,
          title: state.goodsForm.title,
          price: state.goodsForm.price,
          thumbnail: state.goodsForm.coverImg,
          goodsDetail: state.goodsForm.goodsDetail,
        };
        axios.post("/goods/edit", params).then((res) => {
          emit("onCloseEidtDialog", false, res.data);
        });
      }
    });
  };
  return {
    sumbitEdit,
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
    editDialogVisible: Boolean,
    goodsId: Number,
  },
  emits: ["onCloseEidtDialog"],
  setup(props, { emit }) {
    const validateForm = ref();
    const editor = ref();
    const state = reactive({
      editDialogVisible: props.editDialogVisible,
      goodsId: props.goodsId,
      uploadURL: import.meta.env.VITE_APP_URL + "/goods/fileUpload",
      imageUrl: "",
      goodsForm: {
        title: "",
        price: 0,
        coverImg: "",
        goodsDetail: "",
      },
    });
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
    onMounted(() => {
      //   console.log("goodsId=", state.goodsId);
      useLoadEditData(state, editor);
    });
    //上传成功以后，执行的处理函数
    const handleAvatarSuccess = (response) => {
      state.imageUrl = import.meta.env.VITE_APP_URL + response.msg;
      state.goodsForm.coverImg = response.msg;
    };
    const closeEditDialog = (visible) => {
      emit("onCloseEidtDialog", visible);
    };
    return {
      ...toRefs(state),

      rules,

      validateForm,
      editor,
      closeEditDialog,
      handleBeforeUpload,
      handleAvatarSuccess,
      ...useEditData(state, validateForm, editor, emit),
    };
  },
};
</script>

<style></style>
