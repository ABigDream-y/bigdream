<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="课程号" prop="code">
        <el-input v-model="dataForm.code" placeholder="课程号"></el-input>
      </el-form-item>
      <el-form-item label="课程名" prop="name">
        <el-input v-model="dataForm.name" placeholder="课程名"></el-input>
      </el-form-item>
      <el-form-item label="英文课程名" prop="nameEn">
        <el-input v-model="dataForm.nameEn" placeholder="英文课程名"></el-input>
      </el-form-item>
      <el-form-item label="开课单位" prop="unit">
        <el-input v-model="dataForm.unit" placeholder="开课单位"></el-input>
      </el-form-item>
      <el-form-item label="课程类别" prop="category">
        <ren-select v-model="dataForm.category" dict-type="course_category" placeholder="课程类别"></ren-select>
      </el-form-item>
      <el-form-item label="课程分类" prop="type">
        <el-input v-model="dataForm.type" placeholder="课程分类"></el-input>
      </el-form-item>
      <el-form-item label="教学方式" prop="mode">
        <el-input v-model="dataForm.mode" placeholder="教学方式"></el-input>
      </el-form-item>
      <el-form-item label="授课语种" prop="language">
        <el-input v-model="dataForm.language" placeholder="授课语种"></el-input>
      </el-form-item>
      <el-form-item label="考试类型" prop="examType">
        <el-input v-model="dataForm.examType" placeholder="考试类型"></el-input>
      </el-form-item>
      <el-form-item label="课程负责人" prop="courseLeader">
        <el-input v-model="dataForm.courseLeader" placeholder="课程负责人"></el-input>
      </el-form-item>
      <el-form-item label="适用范围" prop="range">
        <el-input v-model="dataForm.range" placeholder="适用范围"></el-input>
      </el-form-item>
      <el-form-item label="是否生成课内实验课" prop="isExperiment">
        <ren-select v-model="dataForm.isExperiment" dict-type="yesOrNo" placeholder="是否生成课内实验课"></ren-select>
      </el-form-item>
      <el-form-item label="学分" prop="credit">
        <el-input v-model="dataForm.credit" placeholder="学分"></el-input>
      </el-form-item>
      <el-form-item label="总学时" prop="totalHours">
        <el-input v-model="dataForm.totalHours" placeholder="总学时"></el-input>
      </el-form-item>
      <el-form-item label="周学时" prop="weekHours">
        <el-input v-model="dataForm.weekHours" placeholder="周学时"></el-input>
      </el-form-item>
      <el-form-item label="授课学时" prop="teachingHours">
        <el-input v-model="dataForm.teachingHours" placeholder="授课学时"></el-input>
      </el-form-item>
      <el-form-item label="实践学时" prop="practicalHours">
        <el-input v-model="dataForm.practicalHours" placeholder="实践学时"></el-input>
      </el-form-item>
      <el-form-item label="上机学时" prop="computerHours">
        <el-input v-model="dataForm.computerHours" placeholder="上机学时"></el-input>
      </el-form-item>
      <el-form-item label="其他学时" prop="otherHours">
        <el-input v-model="dataForm.otherHours" placeholder="其他学时"></el-input>
      </el-form-item>
      <el-form-item label="集中实践周" prop="practiceWeek">
        <el-input v-model="dataForm.practiceWeek" placeholder="集中实践周"></el-input>
      </el-form-item>
      <el-form-item label="教学目的" prop="objective">
        <el-input type="textarea" v-model="dataForm.objective"></el-input>
      </el-form-item>
      <el-form-item label="师资队伍" prop="teachers">
        <el-input type="textarea" v-model="dataForm.teachers"></el-input>
      </el-form-item>
      <el-form-item label="课程说明" prop="description">
        <el-input type="textarea" v-model="dataForm.description"></el-input>
      </el-form-item>
      <el-form-item label="课程教学大纲" prop="syllabus">
        <el-input type="textarea" v-model="dataForm.syllabus"></el-input>
      </el-form-item>
      <el-form-item label="中文教材" prop="textbooksChina">
        <el-input type="textarea" v-model="dataForm.textbooksChina"></el-input>
      </el-form-item>
      <el-form-item label="外文教材" prop="textbooksEn">
        <el-input type="textarea" v-model="dataForm.textbooksEn"></el-input>
      </el-form-item>
      <el-form-item label="中文内容简介" prop="contentChina">
        <el-input type="textarea" v-model="dataForm.contentChina"></el-input>
      </el-form-item>
      <el-form-item label="英文内容简介" prop="contentEn">
        <el-input type="textarea" v-model="dataForm.contentEn"></el-input>
      </el-form-item>
      <el-form-item label="预备知识" prop="knowledge">
        <el-input type="textarea" v-model="dataForm.knowledge"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="课程状态" prop="status">
        <ren-select v-model="dataForm.status" dict-type="enable_status" placeholder="课程状态"></ren-select>
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
        code: "",
        name: "",
        nameEn: "",
        unit: "",
        category: "",
        type: "",
        mode: "",
        language: "",
        examType: "",
        courseLeader: "",
        range: "",
        isExperiment: "",
        credit: "",
        totalHours: "",
        weekHours: "",
        teachingHours: "",
        practicalHours: "",
        computerHours: "",
        otherHours: "",
        practiceWeek: "",
        objective: "",
        teachers: "",
        description: "",
        syllabus: "",
        textbooksChina: "",
        textbooksEn: "",
        contentChina: "",
        contentEn: "",
        knowledge: "",
        remark: "",
        status: "",
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
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        unit: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        category: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        type: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        mode: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        language: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        examType: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        range: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        isExperiment: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        credit: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        totalHours: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        weekHours: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        teachingHours: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/course/courselibrary/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/course/courselibrary", this.dataForm).then((res) => {
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