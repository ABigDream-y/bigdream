<template>
  <div>
    <div class="edit-card--file edit-card-page">
      <div class="aui-card-header">
        <el-button @click="goBack()"
          ><el-icon> <ArrowLeft /> </el-icon>返回</el-button
        >
        <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
      </div>
      <div class="edit-card__body">
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
          <el-card shadow="naver" style="margin-bottom: 20px">
            <el-form-item v-if="!dataForm.id" label="" prop="userId">
              <el-button type="primary" size="large" @click="selectCourse()">选择课程</el-button>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="课程编号" prop="courseNo">
                  <el-input readonly v-model="dataForm.courseNo" size="large" placeholder="课程编号"></el-input>
                </el-form-item>
                <el-form-item label="开课院系" prop="institute">
                  <el-input readonly v-model="dataForm.institute" size="large" placeholder="开课院系"></el-input>
                </el-form-item>
                <el-form-item label="学时" prop="hours">
                  <el-input readonly v-model="dataForm.hours" size="large" placeholder="学时"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="课程名称" prop="courseName">
                  <el-input readonly v-model="dataForm.courseName" size="large" placeholder="课程名称"></el-input>
                </el-form-item>
                <el-form-item label="学分" prop="credit">
                  <el-input readonly v-model="dataForm.credit" size="large" placeholder="学分"></el-input>
                </el-form-item>
                <el-form-item label="课程类别" prop="courseCategory">
                  <ren-select v-model="dataForm.courseCategory" disabled size="large" dict-type="course_category" placeholder="课程类别"></ren-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="课程分类" prop="courseType">
                  <ren-select v-model="dataForm.courseType" disabled size="large" dict-type="course_type" placeholder="课程分类"></ren-select>
                </el-form-item>
                <el-form-item label="教学方式" prop="courseMode">
                  <ren-select v-model="dataForm.courseMode" disabled size="large" dict-type="course_mode" placeholder="教学方式"></ren-select>
                </el-form-item>
                <el-form-item label="考试类型" prop="examType">
                  <ren-select v-model="dataForm.examType" disabled size="large" dict-type="exam_type" placeholder="考试类型"></ren-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="计划学年" prop="planGrade">
                <ren-select v-model="dataForm.planGrade" size="large" dict-type="school_year" placeholder="计划学年"></ren-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划学期" prop="planTerm">
                <ren-select v-model="dataForm.planTerm" size="large" dict-type="term" placeholder="计划学期"></ren-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否主干课程" prop="mainCourse">
                <ren-radio-group v-model="dataForm.mainCourse" size="large" dict-type="yesOrNo"></ren-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" type="textarea" size="large" :rows="5" placeholder="备注" show-word-limit maxlength="255"></el-input>
          </el-form-item>
          <!-- <el-form-item label="状态" prop="status">
					<el-input v-model="dataForm.status" placeholder="状态"></el-input>
				</el-form-item> -->
        </el-form>
      </div>
    </div>
    <course-dialog v-if="courseVisible" ref="courseDialog" @confirm="confirmSelect"></course-dialog>
  </div>
</template>

<script lang="ts">
import { IObject } from "@/types/interface";
import { useStore } from "vuex";
import { findIndex } from "lodash";
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
import CourseDialog from "../dialog/course.vue";
export default defineComponent({
  components: {
    CourseDialog
  },
  setup() {
    const store = useStore();
    return reactive({
      courseVisible: false,
      store,
      loading: false,
      visible: false,
      dataForm: {
        id: "",
        caseId: "",
        groupId: "",
        courseId: "",
        courseNo: "",
        courseName: "",
        institute: "",
        instituteNo: "",
        hours: "",
        credit: "",
        // credit: "",
        // totalHours: "",
        weekHours: "",
        teachingHours: "",
        practicalHours: "",
        computerHours: "",
        otherHours: "",
        courseType: "",
        courseCategory: "",
        courseMode: "",
        examType: "",
        planGrade: "",
        planTerm: "",
        mainCourse: 1,
        remark: "",
        status: ""
      } as IObject
    });
  },
  computed: {
    dataRule() {
      return {
        courseName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        planGrade: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        planTerm: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.loading = false;
      let id = this.$route.query.id || "";
      if (id && id != "0") {
        this.dataForm.id = id;
      }
      console.log("$route", this.$route.query);
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        this.dataForm.groupId = this.$route.query.gid;
        if (this.dataForm.id) {
          this.getInfo();
        }
        console.log("dataForm", this.dataForm);
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/programme/casecourse/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    selectCourse() {
      this.courseVisible = true;
      this.$nextTick(() => {
        this.$refs["courseDialog"].init();
      });
    },
    confirmSelect(data: IObject) {
      console.log("已选中--", data);
      console.log(data.id);
      this.dataForm = {
        ...this.dataForm,
        courseNo: data.code,
        courseName: data.name,
        institute: data.unit,
        instituteNo: data.unitNo,
        hours: data.totalHours,
        credit: data.credit,
        courseType: data.courseType,
        courseCategory: data.courseCategory,
        courseMode: data.courseMode,
        examType: data.examType,
        weekHours: data.weekHours,
        teachingHours: data.teachingHours,
        practicalHours: data.practicalHours,
        computerHours: data.computerHours,
        otherHours: data.otherHours,
        courseId: data.id
      };

      console.log(this.dataForm);
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        (!this.dataForm.id ? baseService.post : baseService.put)("/programme/casecourse", this.dataForm).then((res) => {
          if (res.code !== 0) {
            this.loading = false;
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.loading = false;
              this.goBack();
            }
          });
        });
      });
    },
    goBack() {
      const activeTabName = this.store.state.activeTabName;
      const tabs = this.store.state.tabs;
      let index = findIndex(tabs, (x) => x.value === activeTabName);
      this.store.state.tabs.splice(index, 1);
      this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
      console.info(this.store.state.activeTabName);
      console.log("tabs：", this.store.state.tabs);
      // this.store.state.activeTabName = "/programme/casecourse?_mt=课组一+-+课程列表";
      this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
      this.$router.push(this.store.state.activeTabName);
    },
    updateClosedTabs(closedTabs: any[], isTransform = true) {
      if (isTransform) {
        closedTabs = closedTabs.map((x) => x.value);
      }
      this.store.dispatch({
        type: "updateState",
        payload: {
          closedTabs
        }
      });
    }
  }
});
</script>
