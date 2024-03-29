<template>
  <el-dialog v-model="visible" title="代码生成参数配置" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="默认包名" prop="packageName">
        <el-input v-model="dataForm.packageName" placeholder="默认包名"></el-input>
      </el-form-item>
      <el-form-item label="默认版本号" prop="version">
        <el-input v-model="dataForm.version" placeholder="默认版本号"></el-input>
      </el-form-item>
      <el-form-item label="默认作者" prop="author">
        <el-input v-model="dataForm.author" placeholder="默认作者"></el-input>
      </el-form-item>
      <el-form-item label="作者邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="作者邮箱"></el-input>
      </el-form-item>
      <el-form-item label="后端生成路径" prop="backendPath">
        <el-input v-model="dataForm.backendPath" placeholder="后端生成路径"></el-input>
      </el-form-item>
      <el-form-item label="前端生成路径" prop="frontendPath">
        <el-input v-model="dataForm.frontendPath" placeholder="前端生成路径"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      dataForm: {
        packageName: "",
        version: "",
        author: "",
        email: "",
        backendPath: "",
        frontendPath: ""
      }
    });
  },
  computed: {
    dataRule() {
      return {
        packageName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        version: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        author: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        backendPath: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        frontendPath: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        this.getInfo();
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/devtools/param/info").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        };
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        baseService.post("/devtools/param", this.dataForm).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.visible = false;
              this.$emit("refreshDataList");
            }
          });
        });
      });
    }
  }
});
</script>
