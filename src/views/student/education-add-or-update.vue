<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="dataForm.userId" placeholder="用户id"></el-input>
      </el-form-item>
      <el-form-item label="单位名称" prop="unit">
        <el-input v-model="dataForm.unit" placeholder="单位名称"></el-input>
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker type="date" placeholder="开始日期" value-format="YYYY-MM-DD" v-model="dataForm.startDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker type="date" placeholder="结束日期" value-format="YYYY-MM-DD" v-model="dataForm.endDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="担任职务" prop="post">
        <el-input v-model="dataForm.post" placeholder="担任职务"></el-input>
      </el-form-item>
      <el-form-item label="证明人" prop="certifier">
        <el-input v-model="dataForm.certifier" placeholder="证明人"></el-input>
      </el-form-item>
      <el-form-item label="工作内容" prop="jobContent">
        <el-input v-model="dataForm.jobContent" placeholder="工作内容"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
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
        id: "",
        userId: "",
        unit: "",
        startDate: "",
        endDate: "",
        post: "",
        certifier: "",
        jobContent: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: "",
      }
    });
  },
  computed: {
    dataRule() {
      return {
        userId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        unit: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        startDate: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        endDate: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        post: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        certifier: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        jobContent: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/student/education/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/student/education", this.dataForm).then((res) => {
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