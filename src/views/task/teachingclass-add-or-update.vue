<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="课程名" prop="courseName">
        <el-input v-model="dataForm.courseName" placeholder="课程名"></el-input>
      </el-form-item>
      <el-form-item label="课程号" prop="courseId">
        <el-input v-model="dataForm.courseId" placeholder="课程号"></el-input>
      </el-form-item>
      <el-form-item label="课序号" prop="courseNo">
        <el-input v-model="dataForm.courseNo" placeholder="课序号"></el-input>
      </el-form-item>
      <el-form-item label="班容量" prop="classNum">
        <el-input v-model="dataForm.classNum" placeholder="班容量"></el-input>
      </el-form-item>
      <el-form-item label="上课教师" prop="teacher">
        <el-input v-model="dataForm.teacher" placeholder="上课教师"></el-input>
      </el-form-item>
      <el-form-item label="上课教师" prop="teacherId">
        <el-input v-model="dataForm.teacherId" placeholder="上课教师"></el-input>
      </el-form-item>
      <el-form-item label="上课班级" prop="class">
        <el-input v-model="dataForm.class" placeholder="上课班级"></el-input>
      </el-form-item>
      <el-form-item label="上课班级" prop="classNo">
        <el-input v-model="dataForm.classNo" placeholder="上课班级"></el-input>
      </el-form-item>
      <el-form-item label="校区" prop="campus">
        <el-input v-model="dataForm.campus" placeholder="校区"></el-input>
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
        courseName: "",
        courseId: "",
        courseNo: "",
        classNum: "",
        teacher: "",
        teacherId: "",
        class: "",
        classNo: "",
        campus: "",
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
      baseService.get("/task/teachingclass/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/task/teachingclass", this.dataForm).then((res) => {
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