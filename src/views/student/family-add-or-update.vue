<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="dataForm.userId" placeholder="用户id"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="username">
        <el-input v-model="dataForm.username" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="dataForm.age" placeholder="年龄"></el-input>
      </el-form-item>
      <el-form-item label="关系" prop="relationship">
        <el-input v-model="dataForm.relationship" placeholder="关系"></el-input>
      </el-form-item>
      <el-form-item label="政治面貌" prop="politicalOutlook">
        <ren-select v-model="dataForm.politicalOutlook" dict-type="political_outlook" placeholder="政治面貌"></ren-select>
      </el-form-item>
      <el-form-item label="工作单位" prop="jobUnit">
        <el-input v-model="dataForm.jobUnit" placeholder="工作单位"></el-input>
      </el-form-item>
      <el-form-item label="证件号" prop="idCard">
        <el-input v-model="dataForm.idCard" placeholder="证件号"></el-input>
      </el-form-item>
      <el-form-item label="职业" prop="career">
        <el-input v-model="dataForm.career" placeholder="职业"></el-input>
      </el-form-item>
      <el-form-item label="工作地址" prop="jobAdress">
        <el-input v-model="dataForm.jobAdress" placeholder="工作地址"></el-input>
      </el-form-item>
      <el-form-item label="工作单位联系方式" prop="jobMobile">
        <el-input v-model="dataForm.jobMobile" placeholder="工作单位联系方式"></el-input>
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
        username: "",
        age: "",
        relationship: "",
        politicalOutlook: "",
        jobUnit: "",
        idCard: "",
        career: "",
        jobAdress: "",
        jobMobile: "",
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
        username: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        relationship: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/student/family/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/student/family", this.dataForm).then((res) => {
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