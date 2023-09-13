<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="课程号" prop="courseId">
        <el-input v-model="dataForm.courseId" placeholder="课程号"></el-input>
      </el-form-item>
      <el-form-item label="课程名" prop="courseName">
        <el-input v-model="dataForm.courseName" placeholder="课程名"></el-input>
      </el-form-item>
      <el-form-item label="开课单位" prop="courseUnit">
        <el-input v-model="dataForm.courseUnit" placeholder="开课单位"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <ren-radio-group v-model="dataForm.status" dict-type="yesOrNo"></ren-radio-group>
      </el-form-item>
      <el-form-item label="教学方式" prop="teachingMethods">
        <el-input v-model="dataForm.teachingMethods" placeholder="教学方式"></el-input>
      </el-form-item>
      <el-form-item label="课程负责人" prop="courseHead">
        <el-input v-model="dataForm.courseHead" placeholder="课程负责人"></el-input>
      </el-form-item>
      <el-form-item label="学分" prop="score">
        <el-input v-model="dataForm.score" placeholder="学分"></el-input>
      </el-form-item>
      <el-form-item label="总学时" prop="totalHours">
        <el-input v-model="dataForm.totalHours" placeholder="总学时"></el-input>
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
        courseId: "",
        courseName: "",
        courseUnit: "",
        status: "",
        teachingMethods: "",
        courseHead: "",
        score: "",
        totalHours: "",
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
        courseId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/task/taskcourse/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/task/taskcourse", this.dataForm).then((res) => {
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