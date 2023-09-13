<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="课程号" prop="courseNo">
        <el-input v-model="dataForm.courseNo" placeholder="课程号"></el-input>
      </el-form-item>
      <el-form-item label="课程名" prop="courseName">
        <el-input v-model="dataForm.courseName" placeholder="课程名"></el-input>
      </el-form-item>
      <el-form-item label="开课单位" prop="courseUnit">
        <el-input v-model="dataForm.courseUnit" placeholder="开课单位"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <ren-radio-group v-model="dataForm.status" dict-type="enable_status"></ren-radio-group>
      </el-form-item>
      <el-form-item label="教学方式" prop="teachingMethods">
        <ren-select v-model="dataForm.teachingMethods" dict-type="course_mode" placeholder="教学方式"></ren-select>
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
      <el-form-item label="授课学时" prop="teachingHours">
        <el-input v-model="dataForm.teachingHours" placeholder="授课学时"></el-input>
      </el-form-item>
      <el-form-item label="周学时" prop="weekHours">
        <el-input v-model="dataForm.weekHours" placeholder="周学时"></el-input>
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
      <el-form-item label="校区" prop="campus">
        <el-input v-model="dataForm.campus" placeholder="校区"></el-input>
      </el-form-item>
      <el-form-item label="上课周次" prop="courseNumber">
        <el-input v-model="dataForm.courseNumber" placeholder="上课周次"></el-input>
      </el-form-item>
      <el-form-item label="预计重修人数" prop="expectedRefurbishment">
        <el-input v-model="dataForm.expectedRefurbishment" placeholder="预计重修人数"></el-input>
      </el-form-item>
      <el-form-item label="需求" prop="requirement">
        <el-input v-model="dataForm.requirement" placeholder="需求"></el-input>
      </el-form-item>
      <el-form-item label="教室类型" prop="classroomType">
        <el-input v-model="dataForm.classroomType" placeholder="教室类型"></el-input>
      </el-form-item>
      <el-form-item label="场地id" prop="areaId">
        <el-input v-model="dataForm.areaId" placeholder="场地id"></el-input>
      </el-form-item>
      <el-form-item label="教学楼" prop="building">
        <el-input v-model="dataForm.building" placeholder="教学楼"></el-input>
      </el-form-item>
      <el-form-item label="教室" prop="classroom">
        <el-input v-model="dataForm.classroom" placeholder="教室"></el-input>
      </el-form-item>
      <el-form-item label="是否有性别限制" prop="genderStatus">
        <ren-radio-group v-model="dataForm.genderStatus" dict-type="yesOrNo"></ren-radio-group>
      </el-form-item>
      <el-form-item label="男生人数" prop="maleNum">
        <el-input v-model="dataForm.maleNum" placeholder="男生人数"></el-input>
      </el-form-item>
      <el-form-item label="女生人数" prop="femaleNum">
        <el-input v-model="dataForm.femaleNum" placeholder="女生人数"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="选课说明" prop="description">
        <el-input type="textarea" v-model="dataForm.description"></el-input>
      </el-form-item>
      <el-form-item label="上课周次" prop="courseCount">
        <el-input v-model="dataForm.courseCount" placeholder="上课周次"></el-input>
      </el-form-item>
      <el-form-item label="时间要求" prop="courseTimeRequire">
        <el-input v-model="dataForm.courseTimeRequire" placeholder="时间要求"></el-input>
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
        courseNo: "",
        courseName: "",
        courseUnit: "",
        status: "",
        teachingMethods: "",
        courseHead: "",
        score: "",
        totalHours: "",
        teachingHours: "",
        weekHours: "",
        practicalHours: "",
        computerHours: "",
        otherHours: "",
        campus: "",
        courseNumber: "",
        expectedRefurbishment: "",
        requirement: "",
        classroomType: "",
        areaId: "",
        building: "",
        classroom: "",
        genderStatus: "",
        maleNum: "",
        femaleNum: "",
        remark: "",
        description: "",
        courseCount: "",
        courseTimeRequire: "",
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
      baseService.get("/task/teaching/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/task/teaching", this.dataForm).then((res) => {
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