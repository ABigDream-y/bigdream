<template>
  <div class="edit-card--file edit-card-page">
    <div class="aui-card-header">
      <el-button @click="goBack()">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回
      </el-button>
      <el-button type="primary" v-if="dataForm.status == 0 || dataForm.status == 3" :loading="loading" @click="dataFormSubmitHandle(0)">仅保存</el-button>
      <el-button type="primary" v-if="dataForm.status == 0 || dataForm.status == 3" :loading="loading" @click="dataFormSubmitHandle(2)">{{ dataForm.status == 3 ? "重新" : "" }}提交申请</el-button>
      <el-button type="success" v-if="dataForm.status == 2" :loading="loading" @click="dataFormSubmitHandle(1)">审核通过</el-button>
      <el-button type="danger" v-if="dataForm.status == 2" :loading="loading" @click="dataFormSubmitHandle(3)">审核不通过</el-button>
    </div>
    <div class="edit-card__body">
      <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="24">
            <h3 class="info-h3">
              <span style="margin-right: 15px">课程基本信息</span>
              <!-- 0待提交 1已通过 2待审核 3未通过 -->
              <el-tag type="danger" v-if="dataForm.status == 4">已废弃</el-tag>
              <el-tag size="large" v-if="dataForm.status == 2">待审核</el-tag>
              <el-tag type="danger" v-if="dataForm.status == 3">未通过</el-tag>
              <el-tag type="success" v-if="dataForm.status == 1">已通过</el-tag>
              <el-tag type="info" v-if="dataForm.status == 0">待提交</el-tag>
            </h3>
          </el-col>
          <el-col :span="8">
            <el-form-item label="课程号" prop="code">
              <el-input :readonly="!isEdit" v-model="dataForm.code" size="large" placeholder="课程号"></el-input>
            </el-form-item>
            <el-form-item label="课程类别" prop="courseCategory">
              <ren-select :disabled="!isEdit" v-model="dataForm.courseCategory" size="large" dict-type="course_category" placeholder="课程类别"></ren-select>
            </el-form-item>
            <el-form-item label="授课语种" prop="language">
              <ren-select :disabled="!isEdit" v-model="dataForm.language" size="large" dict-type="language_type" placeholder="授课语种"></ren-select>
              <!-- <el-input v-model="dataForm.language" size="large" placeholder="授课语种"></el-input> -->
            </el-form-item>
            <el-form-item label="开课单位" prop="unit">
              <ren-institute-tree :disabled="!isEdit" v-model="dataForm.unit" size="large" :deptName="dataForm.unit" placeholder="开课单位" nodekey="name" showType="select"></ren-institute-tree>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="课程名" prop="name">
              <el-input :readonly="!isEdit" v-model="dataForm.name" size="large" placeholder="课程名"></el-input>
            </el-form-item>
            <el-form-item label="课程分类" prop="courseType">
              <ren-select :disabled="!isEdit" v-model="dataForm.courseType" size="large" dict-type="course_type" placeholder="课程分类"></ren-select>
            </el-form-item>
            <el-form-item label="考试类型" prop="examType">
              <ren-select :disabled="!isEdit" v-model="dataForm.examType" size="large" dict-type="exam_type" placeholder="考试类型"></ren-select>
            </el-form-item>
            <el-form-item label="适用范围" prop="range">
              <el-input :readonly="!isEdit" v-model="dataForm.range" size="large" placeholder="适用范围"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文课程名" prop="nameEn">
              <el-input :readonly="!isEdit" v-model="dataForm.nameEn" size="large" placeholder="英文课程名"></el-input>
            </el-form-item>
            <el-form-item label="教学方式" prop="courseMode">
              <ren-select :disabled="!isEdit" v-model="dataForm.courseMode" size="large" dict-type="course_mode" placeholder="教学方式"></ren-select>
            </el-form-item>
            <el-form-item label="课程负责人" prop="courseLeader">
              <el-input :readonly="!isEdit" v-model="dataForm.courseLeader" size="large" placeholder="课程负责人"></el-input>
            </el-form-item>
            <el-form-item label="是否生成课内实验课" prop="isExperiment">
              <ren-select :disabled="!isEdit" v-model="dataForm.isExperiment" size="large" dict-type="yesOrNo" placeholder="是否生成课内实验课"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <h3 class="info-h3">课程学时信息</h3>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学分" prop="credit">
              <el-input-number :disabled="!isEdit" v-model="dataForm.credit" size="large" placeholder="学分" :min="0" :precision="1" :step="0.5"></el-input-number>
            </el-form-item>
            <el-form-item label="授课学时" prop="teachingHours">
              <el-input-number :disabled="!isEdit" v-model="dataForm.teachingHours" size="large" placeholder="授课学时" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="其他学时" prop="otherHours">
              <el-input-number :disabled="!isEdit" v-model="dataForm.otherHours" size="large" placeholder="其他学时" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总学时" prop="totalHours">
              <el-input-number :disabled="!isEdit" v-model="dataForm.totalHours" size="large" placeholder="总学时" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="实践学时" prop="practicalHours">
              <el-input-number :disabled="!isEdit" v-model="dataForm.practicalHours" size="large" placeholder="实践学时" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="集中实践周" prop="practiceWeek">
              <el-input-number :disabled="!isEdit" v-model="dataForm.practiceWeek" size="large" placeholder="集中实践周" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="周学时" prop="weekHours">
              <el-input-number :disabled="!isEdit" v-model="dataForm.weekHours" size="large" placeholder="周学时" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="上机学时" prop="computerHours">
              <el-input-number :disabled="!isEdit" v-model="dataForm.computerHours" size="large" placeholder="上机学时" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <h3 class="info-h3">课程简介信息</h3>
          </el-col>
          <el-col :span="24">
            <el-form-item label="教学目的" prop="objective">
              <el-input :readonly="!isEdit" type="textarea" v-model="dataForm.objective" size="large" :rows="5" show-word-limit maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="师资队伍" prop="teachers">
              <el-input :readonly="!isEdit" type="textarea" v-model="dataForm.teachers" size="large" :rows="5" show-word-limit maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="课程说明" prop="description">
              <el-input :readonly="!isEdit" type="textarea" v-model="dataForm.description" size="large" :rows="5" show-word-limit maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="课程教学大纲" prop="syllabus">
              <el-input :readonly="!isEdit" type="textarea" v-model="dataForm.syllabus" size="large" :rows="5" show-word-limit maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="中文教材" prop="textbooksChina">
              <el-input :readonly="!isEdit" type="textarea" v-model="dataForm.textbooksChina" size="large" :rows="5" show-word-limit maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="外文教材" prop="textbooksEn">
              <el-input :readonly="!isEdit" type="textarea" v-model="dataForm.textbooksEn" size="large" :rows="5" show-word-limit maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="中文内容简介" prop="contentChina">
              <el-input :readonly="!isEdit" type="textarea" v-model="dataForm.contentChina" size="large" :rows="5" show-word-limit maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="英文内容简介" prop="contentEn">
              <el-input :readonly="!isEdit" type="textarea" v-model="dataForm.contentEn" size="large" :rows="5" show-word-limit maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="预备知识" prop="knowledge">
              <el-input :readonly="!isEdit" type="textarea" v-model="dataForm.knowledge" size="large" :rows="5" show-word-limit maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input :readonly="!isEdit" type="textarea" v-model="dataForm.remark" size="large" :rows="5" show-word-limit maxlength="255"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { findIndex } from "lodash";
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    const store = useStore();
    return reactive({
      store,
      loading: false,
      visible: false,
      isEdit: true,
      dataForm: {
        id: "",
        code: "",
        name: "",
        nameEn: "",
        unit: "",
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
        status: 0,
        courseType: "",
        courseCategory: "",
        courseMode: ""
      }
    });
  },
  computed: {
    dataRule() {
      return {
        code: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
        teachingHours: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  activated() {
    this.init();
  },
  watch: {
    dataForm: {
      handler(val) {
        console.log("new data ", val);
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.isEdit = true;
      this.loading = false;
      let id = this.$route.query.id || "";
      if (id && id != "0") {
        this.dataForm.id = id;
      }
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
        if (res.data.status == 2 || res.data.status == 1 || res.data.status == 4) {
          this.isEdit = false;
        }
        this.dataForm = res.data;
        console.log("data: ", this.dataForm);
      });
    },
    // 表单提交
    dataFormSubmitHandle(status: number) {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        let postData = JSON.parse(JSON.stringify(this.dataForm));
        postData["status"] = status;
        this.loading = true;
        (!this.dataForm.id ? baseService.post : baseService.put)("/course/courselibrary", postData).then((res) => {
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
			  console.log("back");
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
      // this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
      // this.store.state.activeTabName = "/course/courselibrary";
	  this.store.state.activeTabName = "/course/course";
      this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
	  console.log(this.store.state.activeTabName)
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
