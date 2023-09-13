<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="计划id" prop="planId">
        <el-input v-model="dataForm.planId" placeholder="计划id"></el-input>
      </el-form-item>
      <el-form-item label="课程号" prop="courseNo">
        <el-input v-model="dataForm.courseNo" placeholder="课程号"></el-input>
      </el-form-item>
      <el-form-item label="课程名" prop="courseName">
        <el-input v-model="dataForm.courseName" placeholder="课程名"></el-input>
      </el-form-item>
      <el-form-item label="课程类别" prop="courseType">
        <ren-select v-model="dataForm.courseType" dict-type="course_category" placeholder="课程类别"></ren-select>
      </el-form-item>
      <el-form-item label="课程性质" prop="courseShape">
        <el-input v-model="dataForm.courseShape" placeholder="课程性质"></el-input>
      </el-form-item>
      <el-form-item label="学分" prop="credit">
        <el-input v-model="dataForm.credit" placeholder="学分"></el-input>
      </el-form-item>
      <el-form-item label="学时" prop="hours">
        <el-input v-model="dataForm.hours" placeholder="学时"></el-input>
      </el-form-item>
      <el-form-item label="周学时" prop="weekHours">
        <el-input v-model="dataForm.weekHours" placeholder="周学时"></el-input>
      </el-form-item>
      <el-form-item label="授课学时" prop="teachingHours">
        <el-input v-model="dataForm.teachingHours" placeholder="授课学时"></el-input>
      </el-form-item>
      <el-form-item label="实验学时" prop="practicalHours">
        <el-input v-model="dataForm.practicalHours" placeholder="实验学时"></el-input>
      </el-form-item>
      <el-form-item label="上机学时" prop="computerHours">
        <el-input v-model="dataForm.computerHours" placeholder="上机学时"></el-input>
      </el-form-item>
      <el-form-item label="其他学时" prop="otherHours">
        <el-input v-model="dataForm.otherHours" placeholder="其他学时"></el-input>
      </el-form-item>
      <el-form-item label="变更说明" prop="description">
        <el-input type="textarea" v-model="dataForm.description"></el-input>
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
        planId: "",
        courseNo: "",
        courseName: "",
        courseType: "",
        courseShape: "",
        credit: "",
        hours: "",
        weekHours: "",
        teachingHours: "",
        practicalHours: "",
        computerHours: "",
        otherHours: "",
        description: "",
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
        courseNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        courseName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/plan/planrecord/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/plan/planrecord", this.dataForm).then((res) => {
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