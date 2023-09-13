<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="课组名" prop="name">
        <el-input v-model="dataForm.name" placeholder="课组名"></el-input>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
      </el-form-item>
      <el-form-item label="课组类型" prop="category">
        <ren-select v-model="dataForm.category" dict-type="course_group_type" placeholder="课组类型"></ren-select>
      </el-form-item>
      <el-form-item label="院系" prop="institute">
        <el-input v-model="dataForm.institute" placeholder="院系"></el-input>
      </el-form-item>
      <el-form-item label="院系" prop="instituteNo">
        <el-input v-model="dataForm.instituteNo" placeholder="院系"></el-input>
      </el-form-item>
      <el-form-item label="任选课类别" prop="courseType">
        <ren-select v-model="dataForm.courseType" dict-type="course_type" placeholder="任选课类别"></ren-select>
      </el-form-item>
      <el-form-item label="课程类别" prop="courseCategory">
        <ren-select v-model="dataForm.courseCategory" dict-type="course_category" placeholder="课程类别"></ren-select>
      </el-form-item>
      <el-form-item label="最少修读学分" prop="scoreMin">
        <el-input v-model="dataForm.scoreMin" placeholder="最少修读学分"></el-input>
      </el-form-item>
      <el-form-item label="最少修读门数" prop="courseMin">
        <el-input v-model="dataForm.courseMin" placeholder="最少修读门数"></el-input>
      </el-form-item>
      <el-form-item label="最少完成课组数" prop="groupMin">
        <el-input v-model="dataForm.groupMin" placeholder="最少完成课组数"></el-input>
      </el-form-item>
      <el-form-item label="课程总门数" prop="totalCourse">
        <el-input v-model="dataForm.totalCourse" placeholder="课程总门数"></el-input>
      </el-form-item>
      <el-form-item label="课程总学时" prop="totalHours">
        <el-input v-model="dataForm.totalHours" placeholder="课程总学时"></el-input>
      </el-form-item>
      <el-form-item label="课程总学分" prop="totalScore">
        <el-input v-model="dataForm.totalScore" placeholder="课程总学分"></el-input>
      </el-form-item>
      <el-form-item label="顺序号" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="顺序号"></el-input>
      </el-form-item>
      <el-form-item label="修读要求" prop="requirement">
        <el-input type="textarea" v-model="dataForm.requirement"></el-input>
      </el-form-item>
      <el-form-item label="是否校公选课组" prop="publicStatus">
        <ren-radio-group v-model="dataForm.publicStatus" dict-type="yesOrNo"></ren-radio-group>
      </el-form-item>
      <el-form-item label="状态 0不启用 1启用" prop="status">
        <ren-radio-group v-model="dataForm.status" dict-type="yesOrNo"></ren-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
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
        name: "",
        grade: "",
        category: "",
        institute: "",
        instituteNo: "",
        courseType: "",
        courseCategory: "",
        scoreMin: "",
        courseMin: "",
        groupMin: "",
        totalCourse: "",
        totalHours: "",
        totalScore: "",
        sort: "",
        requirement: "",
        publicStatus: "",
        status: "",
        remark: "",
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
        grade: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/programme/coursegroup/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/programme/coursegroup", this.dataForm).then((res) => {
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