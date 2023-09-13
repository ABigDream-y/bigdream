<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="" prop="teachingId">
        <el-input v-model="dataForm.teachingId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="班级" prop="className">
        <el-input v-model="dataForm.className" placeholder="班级"></el-input>
      </el-form-item>
      <el-form-item label="班级编号" prop="classNo">
        <el-input v-model="dataForm.classNo" placeholder="班级编号"></el-input>
      </el-form-item>
      <el-form-item label="人数" prop="number">
        <el-input v-model="dataForm.number" placeholder="人数"></el-input>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-input v-model="dataForm.grade" placeholder="年级"></el-input>
      </el-form-item>
      <el-form-item label="学院" prop="institute">
        <el-input v-model="dataForm.institute" placeholder="学院"></el-input>
      </el-form-item>
      <el-form-item label="学院" prop="instituteNo">
        <el-input v-model="dataForm.instituteNo" placeholder="学院"></el-input>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input v-model="dataForm.major" placeholder="专业"></el-input>
      </el-form-item>
      <el-form-item label="专业方向" prop="majorDirection">
        <el-input v-model="dataForm.majorDirection" placeholder="专业方向"></el-input>
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
        teachingId: "",
        className: "",
        classNo: "",
        number: "",
        grade: "",
        institute: "",
        instituteNo: "",
        major: "",
        majorDirection: "",
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
        teachingId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        className: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/task/teachingclasess/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/task/teachingclasess", this.dataForm).then((res) => {
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